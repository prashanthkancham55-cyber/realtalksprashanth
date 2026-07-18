export type VideoCategory = 'Training' | 'Testimonial' | 'Motivation' | 'Podcast' | 'Interview' | 'Other';
export type VideoStatus   = 'Published' | 'Draft';

export interface Video {
  id:               string;
  title:            string;
  youtube_url:      string;
  youtube_id:       string;
  thumbnail_url:    string;
  category:         VideoCategory;
  description:      string;
  featured:         boolean;
  show_on_homepage: boolean;
  display_order:    number;
  status:           VideoStatus;
  created_at:       string;
  updated_at:       string;
}

export interface VideoFormData {
  title:            string;
  youtube_url:      string;
  youtube_id:       string;
  thumbnail_url:    string;
  category:         VideoCategory;
  description:      string;
  featured:         boolean;
  show_on_homepage: boolean;
  display_order:    number;
  status:           VideoStatus;
}

export const CATEGORY_OPTIONS: VideoCategory[] = [
  'Training', 'Testimonial', 'Motivation', 'Podcast', 'Interview', 'Other',
];

export const STATUS_OPTIONS: VideoStatus[] = ['Published', 'Draft'];

export const EMPTY_FORM: VideoFormData = {
  title:            '',
  youtube_url:      '',
  youtube_id:       '',
  thumbnail_url:    '',
  category:         'Other',
  description:      '',
  featured:         false,
  show_on_homepage: false,
  display_order:    0,
  status:           'Draft',
};

/** Extract the 11-char video ID from any common YouTube URL format */
export function extractYouTubeId(url: string): string {
  if (!url) return '';
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([A-Za-z0-9_-]{11})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return '';
}

/** Build the best available thumbnail URL for a given YouTube video ID */
export function buildThumbnailUrl(videoId: string): string {
  if (!videoId) return '';
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export function buildEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
}
