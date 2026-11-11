import React from 'react';
import { Link } from 'react-router-dom';
import {
  Database,
  Layers,
  ArrowRight,
  ShieldCheck,
  Globe,
  GitBranch,
  Cpu,
  Smartphone,
  CheckCircle2,
  FileCode2,
  Table,
  Workflow
} from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  const entityCards = [
    {
      name: 'countries',
      color: '#0E6B50',
      fields: ['id (PK, varchar)', 'code (ISO 2-char)', 'name', 'currency_code', 'is_live (bool)', 'id_prefix', 'commission_rate'],
      description: 'Central registry driving runtime localization and market enablement.',
    },
    {
      name: 'country_address_levels',
      color: '#0E6B50',
      fields: ['id (PK)', 'country_id (FK)', 'level_order (int)', 'label (e.g. District, County)', 'is_required (bool)'],
      description: 'Defines dynamic administrative divisions per country without database schema migrations.',
    },
    {
      name: 'regions',
      color: '#0E6B50',
      fields: ['id (PK)', 'country_id (FK)', 'parent_id (nullable FK)', 'name (e.g. Central, Western)'],
      description: 'Self-referencing geographical tree for regional rollups and search clustering.',
    },
    {
      name: 'payment_gateways',
      color: '#F2A541',
      fields: ['id (PK, slug)', 'provider (MTN, Airtel, M-Pesa)', 'adapter_key', 'is_active'],
      description: 'Pluggable adapters for domestic Mobile Money and international card networks.',
    },
    {
      name: 'country_payment_gateways',
      color: '#F2A541',
      fields: ['id (PK)', 'country_id (FK)', 'gateway_id (FK)', 'currency', 'deposit_split_pct (30%)'],
      description: 'Configures enabled payment channels and deposit escrow split parameters per sovereign territory.',
    },
    {
      name: 'users & user_roles',
      color: '#0F1A17',
      fields: ['id (PK)', 'phone (E.164)', 'email', 'role (guest, landlord, admin)', 'nin_verified (bool)'],
      description: 'Unified account table with role-based capabilities and identity validation.',
    },
    {
      name: 'landlord_profiles',
      color: '#0F1A17',
      fields: ['id (PK, sequence: UG-L-XXXX)', 'user_id (FK)', 'payout_momo_number', 'approval_status', 'identity_doc_url'],
      description: 'Extended compliance dossier holding tax IDs, passport scans, and payout coordinates.',
    },
    {
      name: 'properties',
      color: '#0E6B50',
      fields: ['id (PK, sequence: UG-KLA-P-XXXX)', 'landlord_id (FK)', 'country_id (FK)', 'base_rate_ugx', 'min_offer_pct', 'address_json'],
      description: 'Core accommodation entity with country-scoped IDs, structured geo-JSON, and negotiation boundaries.',
    },
    {
      name: 'property_calendar',
      color: '#0E6B50',
      fields: ['id (PK)', 'property_id (FK)', 'calendar_date', 'status (available, booked, blocked, pending)', 'booking_id (FK)'],
      description: 'Day-level ledger synchronizing native stays, admin date locks, and external iCal streams.',
    },
    {
      name: 'offers & offer_events',
      color: '#D9643A',
      fields: ['id (PK)', 'property_id (FK)', 'guest_id (FK)', 'offered_rate', 'status (pending, countered, accepted, declined)'],
      description: 'State machine managing direct price bargaining between guest and landlord with event timeline logs.',
    },
    {
      name: 'bookings & payments',
      color: '#1F9D6B',
      fields: ['id (PK, UG-BK-YYYY-XXXXX)', 'property_id (FK)', 'deposit_amount (30%)', 'balance_due (70%)', 'momo_transaction_ref'],
      description: 'Two-phase financial contract: 30% upfront Mobile Money escrow + 70% physical handover.',
    },
    {
      name: 'commission_invoices',
      color: '#1F9D6B',
      fields: ['id (PK, UG-INV-YYYY-XXXX)', 'landlord_id (FK)', 'booking_id (FK)', 'commission_amount (10%)', 'status (due, paid)'],
      description: 'Automated 10% platform revenue billing engine settled via direct host Mobile Money pushes.',
    },
  ];

  const architecturalPillars = [
    {
      title: 'Country Config Drives Forms Dynamically',
      icon: Globe,
      description:
        'Instead of hardcoding "Kampala Districts" into forms, the frontend queries country_address_levels. Uganda generates Region → District → City → Area; Kenya automatically switches to County → Sub-County → Ward without deploying new code.',
    },
    {
      title: 'Address Hierarchy Stored as Data, Not Rigid Columns',
      icon: Database,
      description:
        'Because African administrative divisions vary widely (e.g. Rwanda sectors vs. Nigeria LGAs), address fields are modeled as structured JSON keys bound to dynamic schema rules.',
    },
    {
      title: 'Pluggable Domestic Payment Adapters',
      icon: Smartphone,
      description:
        'Each African territory selects its local high-conversion rail: MTN MoMo & Airtel Money for Uganda, M-Pesa for Kenya, and Flutterwave / Paystack for West Africa, while retaining the unified 30% deposit escrow model.',
    },
    {
      title: 'Country-Scoped Sequence Generation',
      icon: Cpu,
      description:
        'IDs are structured logically for field operations: "UG-KLA-P-000124" signifies Uganda, Kampala district, Property #124. This simplifies physical guest verification and multi-country database sharding.',
    },
    {
      title: 'Offer State Machine & Direct Negotiation',
      icon: Workflow,
      description:
        'Stops algorithmic black-box pricing. Landlords establish an automated reservation threshold (e.g. 78% of listed rate) or manually counter-offer, producing an agreed digital rate contract that feeds directly into the cart.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Brief */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#0E6B50] text-[10px] font-bold uppercase tracking-wider mb-3">
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Technical Architecture Brief for Stakeholders</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0F1A17] tracking-tight">
            Multi-Country Scalable Data Model
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7A73] mt-3 leading-relaxed">
            Richard Rental Marketplace is architected as an expandable Pan-African hospitality platform. 
            The system enables instant onboarding of new East and West African sovereign markets via configuration metadata without schema migrations or code rewrites.
          </p>
        </div>

        {/* 5 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {architecturalPillars.map((pillar, i) => {
            const IconComp = pillar.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-[#0F1A17]/8 shadow-2xs space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0E6B50]/10 text-[#0E6B50] flex items-center justify-center">
                  <IconComp className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#0F1A17] leading-snug">
                  {pillar.title}
                </h3>
                <p className="text-xs text-[#6B7A73] leading-relaxed font-light">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Entity Relationship Model Grid */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#0F1A17]/10 shadow-lg space-y-8 mb-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#0F1A17]/8">
            <div>
              <span className="text-[11px] font-bold text-[#0E6B50] uppercase tracking-wider">
                Relational Architecture
              </span>
              <h2 className="font-serif font-bold text-2xl text-[#0F1A17] mt-0.5">
                Core Entity Domain Map
              </h2>
            </div>
            <span className="text-xs font-mono bg-[#FAF7F2] text-[#6B7A73] px-3 py-1.5 rounded-xl border border-[#0F1A17]/8">
              PostgreSQL / Relational Normal Form
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entityCards.map((entity) => (
              <div
                key={entity.name}
                className="rounded-2xl p-5 border border-[#0F1A17]/10 bg-[#FAF7F2] space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#0F1A17]/8 mb-2">
                    <span className="font-mono font-bold text-sm text-[#0F1A17]">
                      {entity.name}
                    </span>
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: entity.color }}
                    />
                  </div>

                  <p className="text-[11px] text-[#6B7A73] mb-3 leading-snug">
                    {entity.description}
                  </p>

                  <ul className="space-y-1 font-mono text-[10px] text-[#0F1A17]/90 bg-white p-2.5 rounded-xl border border-[#0F1A17]/6">
                    {entity.fields.map((f, idx) => (
                      <li key={idx} className="truncate">
                        • {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Offer State Machine Diagram */}
        <div className="bg-[#0B3D2E] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden space-y-6">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold text-[#F2A541] uppercase tracking-wider">
              Finite State Machine
            </span>
            <h2 className="font-serif text-3xl font-bold">Offer Lifecycle & Payment Contract</h2>
            <p className="text-xs text-white/75 leading-relaxed font-light">
              How negotiation transitions from guest proposal to confirmed reservation without locking calendar dates prematurely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-6 border-t border-white/10 text-xs text-center font-bold">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15">
              <span className="text-[10px] text-[#F2A541] block mb-1">State 01</span>
              <span>DRAFT_OFFER</span>
              <p className="text-[10px] font-normal text-white/70 mt-1">Guest inputs proposed rate</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/15">
              <span className="text-[10px] text-[#F2A541] block mb-1">State 02</span>
              <span>PENDING_HOST</span>
              <p className="text-[10px] font-normal text-white/70 mt-1">SMS / WhatsApp dispatch</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/15">
              <span className="text-[10px] text-[#F2A541] block mb-1">State 03</span>
              <span>COUNTER / ACCEPT</span>
              <p className="text-[10px] font-normal text-white/70 mt-1">Host proposes compromise</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/15">
              <span className="text-[10px] text-[#F2A541] block mb-1">State 04</span>
              <span>CART_RESERVED</span>
              <p className="text-[10px] font-normal text-white/70 mt-1">Locked at agreed price</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0E6B50] border border-emerald-400">
              <span className="text-[10px] text-emerald-200 block mb-1">State 05</span>
              <span>MOMO_CONFIRMED</span>
              <p className="text-[10px] font-normal text-white/70 mt-1">30% deposit in escrow</p>
            </div>
          </div>

          <div className="pt-4 flex justify-between items-center text-xs text-white/60">
            <span>Security: 256-bit encrypted USSD tokenization</span>
            <Link to="/admin" className="text-[#F2A541] font-bold hover:underline flex items-center gap-1">
              <span>Test live in Admin Control Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
