'use client';

import LoadingScreen from '@/components/LoadingScreen';
import { BookingModalProvider } from '@/components/BookingModal';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import WhyChooseMe from '@/components/WhyChooseMe';
import TrainingPrograms from '@/components/TrainingPrograms';
import Clients from '@/components/Clients';
import Gallery from '@/components/Gallery';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import BookCall from '@/components/BookCall';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function Home() {
  return (
    <BookingModalProvider>
      <LoadingScreen />
      <Header />
      <main>
        <Hero />
        <About />
        <WhyChooseMe />
        <TrainingPrograms />
        <Clients />
        <Gallery />
        <Testimonials />
        <FAQ />
        <BookCall />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </BookingModalProvider>
  );
}
