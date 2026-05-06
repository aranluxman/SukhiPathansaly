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
    <div className="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-white px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,168,212,0.28),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(200,243,220,0.32),transparent_36%)]" />

      <div className="heart-field" aria-hidden="true">
        <span className="heart-shape heart-one" />
        <span className="heart-shape heart-two" />
        <span className="heart-shape heart-three" />
        <span className="flower-bloom flower-one" />
        <span className="flower-bloom flower-two" />
        <span className="flower-bloom flower-three" />
      </div>

      <section className="relative mx-auto max-w-2xl text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-blush-100 text-5xl shadow-soft animate-heartbeat">
          💌
        </div>
        <h1 className="text-balance text-4xl font-bold leading-tight text-slate-950 sm:text-6xl">
          Happy Mother&apos;s Day, Mom 💌
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
          This is your personal wellness space — built with love by Alux 💕
        </p>
        <button
          className="mt-9 inline-flex items-center justify-center rounded-full bg-blush-300 px-7 py-3.5 text-base font-bold text-white shadow-soft transition duration-200 hover:-translate-y-1 hover:bg-blush-400 focus:outline-none focus:ring-4 focus:ring-blush-200"
          onClick={enterSpace}
          type="button"
        >
          Enter Your Space 🌸
        </button>
      </section>
    </div>
  );
}
