export interface DistrictData {
  id: string;
  name: string;
  region: string;
  listingCount: number;
  tagline: string;
  image: string;
}

export const ugandaDistricts: DistrictData[] = [
  {
    id: 'kampala',
    name: 'Kampala',
    region: 'Central',
    listingCount: 684,
    tagline: 'Seven hills, cosmopolitan culinary scene & rooftop nightlife',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'entebbe',
    name: 'Entebbe',
    region: 'Central',
    listingCount: 198,
    tagline: 'Lake Victoria breezes, botanical gardens & international gateway',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'jinja',
    name: 'Jinja',
    region: 'Eastern',
    listingCount: 142,
    tagline: 'Source of the Nile, white-water adventure & riverside verandas',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'fort-portal',
    name: 'Fort Portal',
    region: 'Western',
    listingCount: 86,
    tagline: 'Crater lake sanctuaries & Rwenzori mountain footpaths',
    image: 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'mbarara',
    name: 'Mbarara',
    region: 'Western',
    listingCount: 78,
    tagline: 'Rolling green dairy hills & authentic Ankole heritage stays',
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'gulu',
    name: 'Gulu',
    region: 'Northern',
    listingCount: 52,
    tagline: 'Cultural eco-villages, warmth and shea butter heartland',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
  },
];
