'use client';

interface Props {
  userEmail: string;
  galleryCount: number;
  testimonialCount: number;
  enquiryCount: number;
}

export default function WelcomeHero({ userEmail }: Props) {
  return (
    <div>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif' }} className="text-3xl font-semibold text-white">
        Dashboard
      </h1>
      <p className="text-sm text-white/40 mt-1">
        Welcome back, {userEmail || 'Admin'} — here's an overview of your platform.
      </p>
    </div>
  );
}
