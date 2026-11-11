import React, { createContext, useContext, useEffect, useReducer } from 'react';
import {
  Booking,
  CartItem,
  CommissionInvoice,
  CountryConfig,
  Landlord,
  Offer,
  Property,
  SubAdmin,
  UserRole,
} from '../types';
import { initialCountries } from '../data/countries';
import { initialProperties } from '../data/properties';
import { initialLandlords } from '../data/landlords';
import { initialOffers } from '../data/initialOffers';
import { initialBookings } from '../data/initialBookings';
import { initialInvoices } from '../data/invoices';
import { initialSubAdmins } from '../data/subadmins';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

interface AppState {
  currentRole: UserRole;
  activeCountryCode: string; // 'UG', 'KE', etc.
  countries: CountryConfig[];
  properties: Property[];
  landlords: Landlord[];
  cart: CartItem[];
  offers: Offer[];
  bookings: Booking[];
  invoices: CommissionInvoice[];
  subAdmins: SubAdmin[];
  savedPropertyIds: string[];
  toasts: Toast[];
  isOffline: boolean;
}

type Action =
  | { type: 'SET_ROLE'; payload: UserRole }
  | { type: 'SET_ACTIVE_COUNTRY'; payload: string }
  | { type: 'UPDATE_COUNTRY_CONFIG'; payload: CountryConfig }
  | { type: 'TOGGLE_COUNTRY_LIVE'; payload: string }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'CREATE_OFFER'; payload: Offer }
  | { type: 'UPDATE_OFFER_STATUS'; payload: { offerId: string; status: Offer['status']; counterPrice?: number; message?: string } }
  | { type: 'CREATE_BOOKING'; payload: Booking }
  | { type: 'BLOCK_DATES'; payload: { propertyId: string; dates: string[] } }
  | { type: 'ADD_PROPERTY'; payload: Property }
  | { type: 'APPROVE_LANDLORD'; payload: string }
  | { type: 'REJECT_LANDLORD'; payload: { landlordId: string; reason: string } }
  | { type: 'ADD_LANDLORD_APPLICATION'; payload: Landlord }
  | { type: 'PAY_INVOICE'; payload: string }
  | { type: 'ADD_SUB_ADMIN'; payload: SubAdmin }
  | { type: 'TOGGLE_SAVE_PROPERTY'; payload: string }
  | { type: 'ADD_TOAST'; payload: Omit<Toast, 'id'> }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'SET_OFFLINE'; payload: boolean };

const STORAGE_KEY = 'richard_marketplace_state_v1';

function getInitialState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        toasts: [],
        isOffline: !navigator.onLine,
      };
    }
  } catch (e) {
    console.warn('Failed to parse state from localStorage', e);
  }

  return {
    currentRole: 'guest',
    activeCountryCode: 'UG',
    countries: initialCountries,
    properties: initialProperties,
    landlords: initialLandlords,
    cart: [],
    offers: initialOffers,
    bookings: initialBookings,
    invoices: initialInvoices,
    subAdmins: initialSubAdmins,
    savedPropertyIds: ['UG-KLA-P-000124', 'UG-EBB-P-000210'],
    toasts: [],
    isOffline: typeof navigator !== 'undefined' ? !navigator.onLine : false,
  };
}

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, currentRole: action.payload };

    case 'SET_ACTIVE_COUNTRY':
      return { ...state, activeCountryCode: action.payload };

    case 'UPDATE_COUNTRY_CONFIG':
      return {
        ...state,
        countries: state.countries.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };

    case 'TOGGLE_COUNTRY_LIVE':
      return {
        ...state,
        countries: state.countries.map((c) =>
          c.id === action.payload ? { ...c, isLive: !c.isLive } : c
        ),
      };

    case 'ADD_TO_CART': {
      // If already in cart with same dates, replace; otherwise append
      const existingIdx = state.cart.findIndex(
        (item) => item.property.id === action.payload.property.id
      );
      let updatedCart: CartItem[];
      if (existingIdx >= 0) {
        updatedCart = [...state.cart];
        updatedCart[existingIdx] = action.payload;
      } else {
        updatedCart = [...state.cart, action.payload];
      }
      return { ...state, cart: updatedCart };
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };

    case 'CLEAR_CART':
      return { ...state, cart: [] };

    case 'CREATE_OFFER':
      return {
        ...state,
        offers: [action.payload, ...state.offers],
      };

    case 'UPDATE_OFFER_STATUS': {
      const { offerId, status, counterPrice, message } = action.payload;
      return {
        ...state,
        offers: state.offers.map((offer) => {
          if (offer.id !== offerId) return offer;
          const newEvent = {
            id: `ev-${Date.now()}`,
            timestamp: new Date().toISOString(),
            actor: (status === 'accepted' || status === 'declined' || status === 'countered'
              ? 'landlord'
              : 'guest') as 'guest' | 'landlord',
            type: (status === 'countered'
              ? 'counter_offered'
              : status === 'accepted'
              ? 'offer_accepted'
              : 'offer_declined') as any,
            amount: counterPrice || offer.offeredPrice,
            message: message || `Offer status changed to ${status}`,
          };
          return {
            ...offer,
            status,
            landlordCounterPrice: counterPrice ?? offer.landlordCounterPrice,
            events: [...offer.events, newEvent],
          };
        }),
      };
    }

    case 'CREATE_BOOKING':
      return {
        ...state,
        bookings: [action.payload, ...state.bookings],
        cart: state.cart.filter((c) => c.property.id !== action.payload.propertyId),
      };

    case 'BLOCK_DATES': {
      const { propertyId, dates } = action.payload;
      return {
        ...state,
        properties: state.properties.map((p) => {
          if (p.id !== propertyId) return p;
          const mergedDates = Array.from(new Set([...p.bookedDates, ...dates]));
          return { ...p, bookedDates: mergedDates };
        }),
      };
    }

    case 'ADD_PROPERTY':
      return {
        ...state,
        properties: [action.payload, ...state.properties],
      };

    case 'APPROVE_LANDLORD':
      return {
        ...state,
        landlords: state.landlords.map((l) =>
          l.id === action.payload ? { ...l, approvalStatus: 'approved', verified: true } : l
        ),
      };

    case 'REJECT_LANDLORD':
      return {
        ...state,
        landlords: state.landlords.map((l) =>
          l.id === action.payload.landlordId
            ? { ...l, approvalStatus: 'rejected', verified: false }
            : l
        ),
      };

    case 'ADD_LANDLORD_APPLICATION':
      return {
        ...state,
        landlords: [...state.landlords, action.payload],
      };

    case 'PAY_INVOICE':
      return {
        ...state,
        invoices: state.invoices.map((inv) =>
          inv.id === action.payload
            ? { ...inv, status: 'paid', paidDate: new Date().toISOString().split('T')[0] }
            : inv
        ),
      };

    case 'ADD_SUB_ADMIN':
      return {
        ...state,
        subAdmins: [...state.subAdmins, action.payload],
      };

    case 'TOGGLE_SAVE_PROPERTY': {
      const exists = state.savedPropertyIds.includes(action.payload);
      return {
        ...state,
        savedPropertyIds: exists
          ? state.savedPropertyIds.filter((id) => id !== action.payload)
          : [...state.savedPropertyIds, action.payload],
      };
    }

    case 'ADD_TOAST': {
      const newToast: Toast = {
        ...action.payload,
        id: `toast-${Date.now()}-${Math.random()}`,
      };
      return {
        ...state,
        toasts: [...state.toasts, newToast],
      };
    }

    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.payload),
      };

    case 'SET_OFFLINE':
      return { ...state, isOffline: action.payload };

    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  activeCountry: CountryConfig;
  showToast: (title: string, message?: string, type?: Toast['type']) => void;
  toggleSave: (propertyId: string) => void;
  isSaved: (propertyId: string) => boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, undefined, getInitialState);

  // Sync to localStorage
  useEffect(() => {
    try {
      const { toasts, isOffline, ...persistable } = state;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }, [state]);

  // Network listener
  useEffect(() => {
    const handleOnline = () => dispatch({ type: 'SET_OFFLINE', payload: false });
    const handleOffline = () => dispatch({ type: 'SET_OFFLINE', payload: true });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const activeCountry =
    state.countries.find((c) => c.code === state.activeCountryCode) ||
    state.countries[0];

  const showToast = (title: string, message?: string, type: Toast['type'] = 'success') => {
    dispatch({ type: 'ADD_TOAST', payload: { title, message, type } });
  };

  const toggleSave = (propertyId: string) => {
    const isNowSaved = !state.savedPropertyIds.includes(propertyId);
    dispatch({ type: 'TOGGLE_SAVE_PROPERTY', payload: propertyId });
    showToast(
      isNowSaved ? 'Saved to Wishlist' : 'Removed from Wishlist',
      undefined,
      'info'
    );
  };

  const isSaved = (propertyId: string) => state.savedPropertyIds.includes(propertyId);

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        activeCountry,
        showToast,
        toggleSave,
        isSaved,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
