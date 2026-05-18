'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { BookIcon, CalendarCheckIcon, HeartIcon, HomeIcon, PlusIcon } from '@/components/Icons';
import { fetchCloudCollection } from '@/lib/cloudStorage';
import { getDailyQuote } from '@/lib/quotes';
import { memoryPhotos } from '@/lib/memories';
import {
  Appointment,
  CLOUD_COLLECTIONS,
  GratitudeEntry,
  STORAGE_KEYS,
  formatDisplayDate,
  getCollection,
  sortOldestByDateTime,
  todayInputValue
} from '@/lib/storage';

function HighlightCard({
  title,
  value,
  detail,
  href,
  children
}: {
  title: string;
  value: string;
  detail: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link className="section-card section-card-hover block" href={href}>
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-luxury-line bg-luxury-gold/10 text-luxury-gold">
        {children}
      </div>
      <p className="soft-label">{title}</p>
      <p className="mt-2 text-3xl font-bold text-luxury-text">{value}</p>
      <p className="mt-2 text-sm leading-6 text-luxury-muted">{detail}</p>
    </Link>
  );
}

export default function Home() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [gratitudeEntries, setGratitudeEntries] = useState<GratitudeEntry[]>([]);
  const today = todayInputValue();
  const quote = useMemo(() => getDailyQuote(), []);

  useEffect(() => {
    setAppointments(getCollection<Appointment>(STORAGE_KEYS.appointments));
    setGratitudeEntries(getCollection<GratitudeEntry>(STORAGE_KEYS.gratitude));

    fetchCloudCollection<Appointment>(CLOUD_COLLECTIONS.appointments)
      .then((cloudAppointments) => {
        if (cloudAppointments.length > 0) {
          setAppointments(cloudAppointments);
        }
      })
      .catch(() => undefined);

    fetchCloudCollection<GratitudeEntry>(CLOUD_COLLECTIONS.gratitude)
      .then((cloudEntries) => {
        if (cloudEntries.length > 0) {
          setGratitudeEntries(cloudEntries);
        }
      })
      .catch(() => undefined);
  }, []);

  const todaysAppointments = appointments.filter((appointment) => appointment.date === today);
  const nextAppointments = sortOldestByDateTime(
    appointments.filter((appointment) => appointment.date >= today)
  ).slice(0, 3);
  const todaysGratitude = gratitudeEntries.filter((entry) => entry.date === today).length;

  const quickLinks = [
    { href: '/appointments', label: 'Open Calendar', icon: CalendarCheckIcon },
    { href: '/gratitude', label: 'Write Gratitude', icon: HeartIcon },
    { href: '/recipes', label: 'Recipe Notebook', icon: BookIcon },
    { href: '/french', label: 'French Practice', icon: BookIcon }
  ];

  return (
    <div className="page-shell">
      <section className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-luxury-line bg-white/75 px-4 py-2 text-sm font-bold text-luxury-gold shadow-gold">
            <HeartIcon className="h-4 w-4" />
            Made with love by Alux
          </div>
          <h1 className="font-serif text-balance text-5xl font-bold leading-tight text-luxury-text sm:text-6xl">
            Sukhi&apos;s <span className="gold-gradient-text">Personal App</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-luxury-muted">
            A soft place for the things that matter most: family memories, appointments, recipes, gratitude, and a little French practice each day.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {quickLinks.map(({ href, label, icon: Icon }) => (
              <Link className="primary-button" href={href} key={href}>
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            ))}
          </div>
        </div>

        <aside className="section-card section-card-hover">
          <p className="soft-label text-luxury-gold">Today&apos;s quote</p>
          <p className="mt-4 font-serif text-3xl font-semibold leading-10 text-luxury-text">&ldquo;{quote}&rdquo;</p>
          <p className="mt-5 text-sm leading-6 text-luxury-muted">
            This changes every day automatically, so the home screen always has a fresh little lift.
          </p>
        </aside>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <HighlightCard
          detail="Events scheduled for today."
          href="/appointments"
          title="Today calendar"
          value={String(todaysAppointments.length)}
        >
          <CalendarCheckIcon />
        </HighlightCard>
        <HighlightCard
          detail="Notes written for today."
          href="/gratitude"
          title="Gratitude"
          value={String(todaysGratitude)}
        >
          <HeartIcon />
        </HighlightCard>
        <HighlightCard
          detail="Family moments saved in the gallery."
          href="#memories"
          title="Memories"
          value={String(memoryPhotos.length)}
        >
          <HomeIcon />
        </HighlightCard>
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="section-card">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="soft-label">Coming up</p>
              <h2 className="mt-1 font-serif text-2xl font-bold text-luxury-text">Next appointments</h2>
            </div>
            <Link className="secondary-button" href="/appointments">
              <PlusIcon className="h-4 w-4" />
              Add
            </Link>
          </div>
          <div className="grid gap-3">
            {nextAppointments.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-luxury-line bg-white/55 p-5 text-sm leading-6 text-luxury-muted">
                Nothing coming up yet. Add an appointment so it is easy to remember.
              </p>
            ) : (
              nextAppointments.map((appointment) => (
                <div className="rounded-2xl border border-luxury-line bg-white/60 p-4" key={appointment.id}>
                  <p className="text-sm font-bold text-luxury-gold">{formatDisplayDate(appointment.date)}</p>
                  <h3 className="mt-1 font-serif text-xl font-bold text-luxury-text">{appointment.title}</h3>
                  <p className="mt-1 text-sm text-luxury-muted">
                    {appointment.time}
                    {appointment.location ? ` · ${appointment.location}` : ''}
                  </p>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="section-card">
          <p className="soft-label">Add to phone</p>
          <h2 className="mt-2 font-serif text-2xl font-bold text-luxury-text">Install Sukhi&apos;s Personal App</h2>
          <p className="mt-3 leading-7 text-luxury-muted">
            On iPhone, open this website in Safari, tap Share, then choose Add to Home Screen. It will open like an app with its own icon.
          </p>
          <div className="mt-6 rounded-3xl border border-luxury-line bg-gradient-to-br from-[#b76e79] to-[#7a9b76] p-6 text-white shadow-gold">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/90 font-serif text-5xl font-bold text-luxury-gold shadow-card">
              S
            </div>
            <p className="mt-5 text-sm font-bold uppercase tracking-[0.18em] text-white/80">Home screen ready</p>
            <p className="mt-2 font-serif text-2xl font-bold">Sukhi&apos;s Personal App</p>
          </div>
        </article>
      </section>

      <section className="section-card section-card-hover mt-10 overflow-hidden" id="memories">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="soft-label text-luxury-gold">Memories</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-luxury-text">Family moments to scroll through</h2>
            <p className="mt-3 max-w-2xl leading-7 text-luxury-muted">
              A peaceful little gallery for Mom to revisit the people and memories that make this space feel like home.
            </p>
          </div>
          <span className="gold-badge">{memoryPhotos.length} photos</span>
        </div>

        <div className="-mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-3">
          {memoryPhotos.map((photo) => (
            <figure
              className="min-w-[84%] snap-start overflow-hidden rounded-3xl border border-luxury-line bg-white/70 sm:min-w-[360px] lg:min-w-[430px]"
              key={photo.src}
            >
              <img alt={photo.alt} className="h-80 w-full object-cover" src={photo.src} />
              <figcaption className="border-t border-luxury-line px-4 py-3 text-sm font-semibold text-luxury-muted">
                {photo.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}
