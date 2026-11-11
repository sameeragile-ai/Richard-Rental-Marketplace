export type UserRole = 'guest' | 'landlord' | 'admin';

export interface CountryConfig {
  id: string;
  code: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  rateToUGX: number; // 1 unit of foreign currency = X UGX
  isLive: boolean;
  idPrefix: string;
  commissionRate: number; // e.g. 0.10 for 10%
  addressHierarchy: string[]; // e.g. ['Region', 'District', 'City', 'Area']
  requiresPostalCode: boolean;
  paymentGateways: string[]; // e.g. ['mtn_momo', 'airtel_money', 'card', 'bank_transfer']
}

export interface Landlord {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  verified: boolean;
  responseTime: string;
  joinedYear: number;
  rating: number;
  totalReviews: number;
  approvalStatus: 'approved' | 'pending' | 'rejected';
  identityDocName?: string;
}

export interface ReviewScore {
  cleanliness: number;
  accuracy: number;
  location: number;
  value: number;
  communication: number;
}

export interface PropertyReview {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorLocation: string;
  date: string;
  rating: number;
  comment: string;
  stayType: 'short' | 'long';
}

export interface Property {
  id: string;
  landlordId: string;
  title: string;
  tagline: string;
  description: string;
  type: 'Villa' | 'Apartment' | 'Lakeside' | 'Long Stay' | 'Studio' | 'Safari Lodge' | 'Hilltop Cottage';
  district: string;
  city: string;
  region: string;
  countryCode: string;
  images: string[];
  pricePerNight: number; // In UGX
  monthlyPrice?: number; // In UGX
  bedrooms: number;
  beds: number;
  baths: number;
  maxGuests: number;
  amenities: string[];
  rating: number;
  reviewCount: number;
  reviewScores: ReviewScore;
  isNegotiable: boolean;
  minOfferPercent: number; // e.g. 0.75 = accepts offers down to 75%
  isInstantBook: boolean;
  isVerified: boolean;
  bookedDates: string[]; // ISO 'YYYY-MM-DD'
  landlord: Landlord;
  addressDetails: Record<string, string>;
  houseRules: string[];
  coordinates?: { lat: number; lng: number };
}

export interface CartItem {
  id: string;
  property: Property;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  ratePerNight: number;
  isNegotiated: boolean;
  originalRate: number;
  agreedOfferId?: string;
  cleaningFee: number;
  serviceFee: number;
  totalAmount: number;
  depositAmount: number;
  balanceDue: number;
}

export interface OfferEvent {
  id: string;
  timestamp: string;
  actor: 'guest' | 'landlord' | 'system';
  type: 'offer_created' | 'counter_offered' | 'offer_accepted' | 'offer_declined';
  amount?: number;
  message?: string;
}

export interface Offer {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  propertyDistrict: string;
  landlordId: string;
  landlordName: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  originalPrice: number;
  offeredPrice: number;
  landlordCounterPrice?: number;
  status: 'pending' | 'countered' | 'accepted' | 'declined' | 'expired';
  message: string;
  createdAt: string;
  events: OfferEvent[];
}

export interface Booking {
  id: string;
  referenceNumber: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  propertyDistrict: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  ratePerNight: number;
  totalAmount: number;
  depositPaid: number;
  balanceDue: number;
  paymentMethod: 'mtn_momo' | 'airtel_money' | 'card' | 'bank_transfer';
  paymentPhone?: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  isNegotiated: boolean;
}

export interface CommissionInvoice {
  id: string;
  invoiceNumber: string;
  landlordId: string;
  landlordName: string;
  propertyTitle: string;
  bookingRef: string;
  totalBookingAmount: number;
  commissionPercent: number;
  commissionAmount: number;
  status: 'paid' | 'due';
  dueDate: string;
  paidDate?: string;
}

export interface SubAdmin {
  id: string;
  name: string;
  email: string;
  roleTitle: string;
  permissions: {
    approvals: boolean;
    payments: boolean;
    countries: boolean;
    support: boolean;
  };
  lastActive: string;
}
