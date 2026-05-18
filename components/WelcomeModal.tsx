'use client';

import { useEffect, useState } from 'react';
import { STORAGE_KEYS } from '@/lib/storage';

export default function WelcomeModal() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    try {
      setVisible(window.localStorage.getItem(STORAGE_KEYS.welcomeSeen) !== 'true');
    } catch {
      setVisible(false);
    }
  }, []);

  function enterSpace() {
    try {
      window.localStorage.setItem(STORAGE_KEYS.welcomeSeen, 'true');
    } catch {
      // The welcome can still dismiss if storage is unavailable.
    }

    setVisible(false);
  }

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-luxury-black px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(183,110,121,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(122,155,118,0.16),transparent_36%)]" />
      <div className="absolute inset-x-0 top-0 h-px gold-shimmer animate-shimmer" />
      <div className="welcome-particles" aria-hidden="true">
        <span className="gold-particle" />
        <span className="gold-particle" />
        <span className="gold-particle" />
        <span className="gold-particle" />
        <span className="gold-particle" />
      </div>

      <section className="relative mx-auto max-w-3xl text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] border border-luxury-line bg-gradient-to-br from-[#b76e79] to-[#7a9b76] font-serif text-5xl font-bold text-white shadow-gold animate-heartbeat">
          S
        </div>
        <h1 className="font-serif text-balance text-4xl font-bold leading-tight text-luxury-text sm:text-6xl">
          Welcome to Sukhi&apos;s Personal App
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-luxury-muted sm:text-xl">
          A personal space for memories, appointments, recipes, gratitude, and French practice, built with love by Alux.
        </p>
        <button className="primary-button mt-9 px-7 py-3.5 text-base" onClick={enterSpace} type="button">
          Enter Your Space
        </button>
      </section>
    </div>
  );
}
