'use client';

import { motion } from 'framer-motion';

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/918143062777"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2.5, type: 'spring', stiffness: 200, damping: 15 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.93 }}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-2xl"
      style={{ background: '#25D366', boxShadow: '0 4px 24px rgba(37,211,102,0.40)' }}
    >
      {/* Pulse ring */}
      <span
        className="absolute inset-0 rounded-full animate-ping"
        style={{ background: 'rgba(37,211,102,0.35)', animationDuration: '2.2s' }}
      />

      {/* Official WhatsApp SVG icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="w-8 h-8 relative z-10"
        fill="white"
      >
        <path d="M16.003 2.667C8.636 2.667 2.667 8.636 2.667 16c0 2.37.634 4.59 1.74 6.503L2.667 29.333l6.98-1.716A13.285 13.285 0 0016.003 29.333c7.364 0 13.33-5.97 13.33-13.333 0-7.364-5.966-13.333-13.33-13.333zm0 24c-1.974 0-3.84-.497-5.48-1.37l-.392-.22-4.145 1.02 1.055-3.988-.24-.403A10.65 10.65 0 015.333 16C5.333 10.11 10.11 5.333 16.003 5.333c5.892 0 10.664 4.777 10.664 10.667 0 5.89-4.772 10.667-10.664 10.667zm5.847-7.99c-.32-.16-1.89-.933-2.183-1.04-.294-.107-.507-.16-.72.16-.214.32-.827 1.04-.813 1.254.013.213-.107.32-.32.426-.214.107-1.895.933-3.614-.24-1.32-.87-2.293-2.027-2.64-2.347-.346-.32-.04-.493.14-.653.16-.16.32-.4.48-.6.16-.2.213-.347.32-.56.107-.213.053-.4-.027-.56-.08-.16-.72-1.733-.987-2.373-.267-.613-.54-.533-.72-.547-.187-.013-.4-.013-.614-.013-.213 0-.56.08-.853.4-.294.32-1.12 1.093-1.12 2.666s1.147 3.094 1.307 3.307c.16.213 2.24 3.413 5.44 4.787.76.32 1.347.507 1.813.653.76.24 1.454.2 2 .12.614-.093 1.89-.773 2.16-1.52.267-.747.267-1.387.187-1.52-.08-.133-.294-.213-.614-.373z"/>
      </svg>
    </motion.a>
  );
}
