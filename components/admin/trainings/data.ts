export type TrainingMode     = 'Online' | 'Offline' | 'Hybrid';
export type TrainingStatus   = 'Active' | 'Upcoming' | 'Completed' | 'Draft';
export type TrainingCategory = 'Sales' | 'Leadership' | 'Communication' | 'Real Estate' | 'Corporate' | 'Mindset';

export interface Training {
  id:          string;
  banner:      string;
  name:        string;
  description: string;
  trainer:     string;
  category:    TrainingCategory;
  date:        string;
  endDate:     string;
  duration:    string;
  mode:        TrainingMode;
  location:    string;
  price:       number;
  seatsTotal:  number;
  seatsFilled: number;
  status:      TrainingStatus;
  tags:        string[];
}

export const SAMPLE_TRAININGS: Training[] = [
  {
    id: 'tr-001',
    banner: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
    name: 'Sales Excellence Bootcamp',
    description: 'An intensive 2-day program to master consultative selling, objection handling, and closing.',
    trainer: 'Prashanth Kumar',
    category: 'Sales',
    date: 'Aug 12, 2026',
    endDate: 'Aug 13, 2026',
    duration: '2 days',
    mode: 'Offline',
    location: 'Bangalore',
    price: 12500,
    seatsTotal: 30,
    seatsFilled: 22,
    status: 'Active',
    tags: ['Sales', 'B2B', 'Closing'],
  },
  {
    id: 'tr-002',
    banner: 'https://images.pexels.com/photos/5669619/pexels-photo-5669619.jpeg?auto=compress&cs=tinysrgb&w=400',
    name: 'Leadership Masterclass',
    description: 'Transform your leadership style with proven frameworks used by top Fortune 500 companies.',
    trainer: 'Prashanth Kumar',
    category: 'Leadership',
    date: 'Aug 20, 2026',
    endDate: 'Aug 22, 2026',
    duration: '3 days',
    mode: 'Online',
    location: 'Virtual',
    price: 8999,
    seatsTotal: 50,
    seatsFilled: 14,
    status: 'Upcoming',
    tags: ['Leadership', 'Management', 'Teams'],
  },
  {
    id: 'tr-003',
    banner: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400',
    name: 'Corporate Communication',
    description: 'Master business writing, presentation skills, and executive presence for the modern workplace.',
    trainer: 'Prashanth Kumar',
    category: 'Communication',
    date: 'Sep 05, 2026',
    endDate: 'Sep 06, 2026',
    duration: '2 days',
    mode: 'Hybrid',
    location: 'Mumbai',
    price: 7500,
    seatsTotal: 25,
    seatsFilled: 0,
    status: 'Draft',
    tags: ['Communication', 'Presentation', 'Email'],
  },
  {
    id: 'tr-004',
    banner: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=400',
    name: 'Real Estate Sales Training',
    description: 'Specialized techniques for high-ticket property sales, site visit conversions, and developer negotiations.',
    trainer: 'Prashanth Kumar',
    category: 'Real Estate',
    date: 'Sep 18, 2026',
    endDate: 'Sep 18, 2026',
    duration: '1 day',
    mode: 'Offline',
    location: 'Hyderabad',
    price: 6500,
    seatsTotal: 40,
    seatsFilled: 28,
    status: 'Upcoming',
    tags: ['Real Estate', 'Property', 'Site Visit'],
  },
  {
    id: 'tr-005',
    banner: 'https://images.pexels.com/photos/3153198/pexels-photo-3153198.jpeg?auto=compress&cs=tinysrgb&w=400',
    name: 'Advanced Negotiation Skills',
    description: 'Evidence-based negotiation strategies for enterprise deals and high-pressure sales environments.',
    trainer: 'Prashanth Kumar',
    category: 'Sales',
    date: 'Jul 28, 2026',
    endDate: 'Jul 29, 2026',
    duration: '2 days',
    mode: 'Online',
    location: 'Virtual',
    price: 9999,
    seatsTotal: 35,
    seatsFilled: 35,
    status: 'Active',
    tags: ['Negotiation', 'Enterprise', 'Strategy'],
  },
  {
    id: 'tr-006',
    banner: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=400',
    name: 'Customer Relationship Mastery',
    description: 'Build long-term client loyalty through emotional intelligence, trust frameworks, and follow-up systems.',
    trainer: 'Prashanth Kumar',
    category: 'Sales',
    date: 'Jul 10, 2026',
    endDate: 'Jul 10, 2026',
    duration: '1 day',
    mode: 'Offline',
    location: 'Chennai',
    price: 5500,
    seatsTotal: 45,
    seatsFilled: 45,
    status: 'Completed',
    tags: ['CRM', 'Loyalty', 'Retention'],
  },
  {
    id: 'tr-007',
    banner: 'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=400',
    name: 'Public Speaking Fundamentals',
    description: 'Overcome stage fright, structure compelling talks, and deliver with unshakeable confidence.',
    trainer: 'Prashanth Kumar',
    category: 'Communication',
    date: 'Jun 25, 2026',
    endDate: 'Jun 26, 2026',
    duration: '2 days',
    mode: 'Online',
    location: 'Virtual',
    price: 4999,
    seatsTotal: 60,
    seatsFilled: 60,
    status: 'Completed',
    tags: ['Speaking', 'Confidence', 'Storytelling'],
  },
  {
    id: 'tr-008',
    banner: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400',
    name: 'Body Language & Confidence',
    description: 'Harness the power of non-verbal communication to lead with authority and read the room.',
    trainer: 'Prashanth Kumar',
    category: 'Corporate',
    date: 'Aug 05, 2026',
    endDate: 'Aug 05, 2026',
    duration: '1 day',
    mode: 'Offline',
    location: 'Pune',
    price: 5000,
    seatsTotal: 30,
    seatsFilled: 18,
    status: 'Active',
    tags: ['Body Language', 'NVC', 'Presence'],
  },
  {
    id: 'tr-009',
    banner: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400',
    name: 'Sales Mindset Transformation',
    description: 'Reprogram limiting beliefs and build the mental resilience needed to thrive in competitive markets.',
    trainer: 'Prashanth Kumar',
    category: 'Mindset',
    date: 'Sep 30, 2026',
    endDate: 'Oct 01, 2026',
    duration: '2 days',
    mode: 'Hybrid',
    location: 'Delhi',
    price: 11000,
    seatsTotal: 20,
    seatsFilled: 4,
    status: 'Upcoming',
    tags: ['Mindset', 'Psychology', 'Resilience'],
  },
  {
    id: 'tr-010',
    banner: 'https://images.pexels.com/photos/1181605/pexels-photo-1181605.jpeg?auto=compress&cs=tinysrgb&w=400',
    name: 'Retail Sales Excellence',
    description: 'Structured selling system for retail floor teams — increase conversion, upsell, and manage footfall.',
    trainer: 'Prashanth Kumar',
    category: 'Sales',
    date: 'Oct 15, 2026',
    endDate: 'Oct 15, 2026',
    duration: '1 day',
    mode: 'Offline',
    location: 'Kolkata',
    price: 4500,
    seatsTotal: 50,
    seatsFilled: 0,
    status: 'Draft',
    tags: ['Retail', 'Floor Sales', 'Upsell'],
  },
];

export const STATUS_OPTIONS = [
  { value: '',          label: 'All Status' },
  { value: 'Active',    label: 'Active' },
  { value: 'Upcoming',  label: 'Upcoming' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Draft',     label: 'Draft' },
];

export const CATEGORY_OPTIONS = [
  { value: '',            label: 'All Categories' },
  { value: 'Sales',       label: 'Sales' },
  { value: 'Leadership',  label: 'Leadership' },
  { value: 'Communication', label: 'Communication' },
  { value: 'Real Estate', label: 'Real Estate' },
  { value: 'Corporate',   label: 'Corporate' },
  { value: 'Mindset',     label: 'Mindset' },
];

export const MODE_OPTIONS = [
  { value: '',        label: 'All Modes' },
  { value: 'Online',  label: 'Online' },
  { value: 'Offline', label: 'Offline' },
  { value: 'Hybrid',  label: 'Hybrid' },
];

export const PER_PAGE = 5;
