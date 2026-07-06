import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type GalleryImage = {
  id: string;
  image_url: string;
  alt_text: string;
  display_order: number;
  created_at: string;
};

export type Testimonial = {
  id: string;
  name: string;
  designation: string;
  company: string;
  photo_url: string;
  review: string;
  rating: number;
  created_at: string;
};

export type ContactEnquiry = {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  message: string;
  is_read: boolean;
  created_at: string;
};
