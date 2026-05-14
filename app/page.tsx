'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  BookIcon,
  CalendarCheckIcon,
  HeartIcon,
  ListIcon,
  MoonIcon,
  PlusIcon,
  TargetIcon
} from '@/components/Icons';
import { getDailyQuote } from '@/lib/quotes';

function renderBoldQuote(quote: string): React.ReactNode[] {
  return quote.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : part
  );
}
import { memoryPhotos } from '@/lib/memories';
import {
  Goal,
  Appointment,
  STORAGE_KEYS,
  SleepLog,
  TaskList,
  getCollection,
  GratitudeEntry,
  getTaskLists,
  isSameDate,
  todayInputValue
} from '@/lib/storage';

function SummaryCard({
  title,
  value,
  detail,
  children
}: {
  title: string;
  value: string;
  detail: string;
  children: React.ReactNode;
}) {
  return (
    <article className="section-card section-card-hover">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-luxury-line bg-luxury-gold/10 text-luxury-gold-light">
        {children}
      </div>
      <p className="soft-label">{title}</p>
      <p className="mt-2 text-3xl font-bold text-luxury-text">{value}</p>
      <p className="mt-2 text-sm leading-6 text-luxury-muted">{detail}</p>
    </article>
  );
}

export default function Home() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>([]);
  const [gratitudeEntries, setGratitudeEntries] = useState<GratitudeEntry[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const today = todayInputValue();
  const quote = useMemo(() => getDailyQuote(), []);

  useEffect(() => {
    setGoals(getCollection<Goal>(STORAGE_KEYS.goals));
    setTaskLists(getTaskLists());
    setSleepLogs(getCollection<SleepLog>(STORAGE_KEYS.sleep));
    setGratitudeEntries(getCollection<GratitudeEntry>(STORAGE_KEYS.gratitude));
    setAppointments(getCollection<Appointment>(STORAGE_KEYS.appointments));
  }, []);

  const activeGoals = goals.filter((goal) => goal.status === 'In Progress').length;
  const pendingTasks = taskLists.reduce(
    (sum, list) => sum + list.tasks.filter((task) => !task.completed).length,
    0
  );
  const lastNightSleep = sleepLogs.find((log) => log.date === today)?.hours;
  const todaysGratitude = gratitudeEntries.filter((entry) => entry.date === today).length;
  const todaysAppointments = appointments.filter((appointment) => appointment.date === today).length;

  const quickLinks = [
    { href: '/recipes', label: 'Find Recipes', icon: BookIcon },
    { href: '/goals', label: 'Set Goal', icon: TargetIcon },
    { href: '/tasks', label: 'Open Tasks', icon: ListIcon },
    { href: '/sleep', label: 'Log Sleep', icon: MoonIcon },
    { href: '/gratitude', label: 'Gratitude', icon: HeartIcon },
    { href: '/appointments', label: 'Appointments', icon: CalendarCheckIcon },
    { href: '/french', label: 'French Study', icon: BookIcon }
  ];

  return (
    <div className="page-shell">
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-luxury-line bg-luxury-card px-4 py-2 text-sm font-bold text-luxury-gold-light shadow-gold">
            <HeartIcon className="h-4 w-4" />
            Made with love by Alux
          </div>
          <h1 className="font-serif text-balance text-4xl font-bold leading-tight text-luxury-text sm:text-5xl">
            Welcome back, Sukhi 💛
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-luxury-muted">
            A calm, polished space to track recipes, goals, tasks, gratitude, sleep, appointments, and French practice.
          </p>
        </div>

        <aside className="section-card section-card-hover">
          <p className="soft-label text-luxury-gold-light">Today&apos;s quote</p>
          <p className="mt-4 font-serif text-2xl font-semibold leading-9 text-luxury-text">
            &ldquo;{renderBoldQuote(quote)}&rdquo;
          </p>
        </aside>
      </section>

      <section className="section-card section-card-hover mt-10 overflow-hidden">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="soft-label text-luxury-gold-light">Memories</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-luxury-text">Family moments to scroll through</h2>
            <p className="mt-3 max-w-2xl leading-7 text-luxury-muted">
              A peaceful little gallery for Mom to revisit the people and memories that make this space feel like home.
            </p>
          </div>
          <span className="gold-badge">{memoryPhotos.length} photo{memoryPhotos.length === 1 ? '' : 's'}</span>
        </div>

        <div className="-mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-3">
          {memoryPhotos.map((photo) => (
            <figure
              className="min-w-[82%] snap-start overflow-hidden rounded-xl border border-luxury-line bg-black/25 sm:min-w-[360px] lg:min-w-[420px]"
              key={photo.src}
            >
              <img alt={photo.alt} className="h-72 w-full object-cover" src={photo.src} />
              <figcaption className="border-t border-luxury-line px-4 py-3 text-sm font-semibold text-luxury-muted">
                {photo.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard detail="Goals still moving forward." title="Active goals" value={String(activeGoals)}>
          <TargetIcon />
        </SummaryCard>
        <SummaryCard detail="Open items across every list." title="Pending tasks" value={String(pendingTasks)}>
          <ListIcon />
        </SummaryCard>
        <SummaryCard
          detail="Sleep hours logged for today."
          title="Sleep logged"
          value={lastNightSleep ? `${lastNightSleep}h` : '0h'}
        >
          <MoonIcon />
        </SummaryCard>
        <SummaryCard detail="Gratitude notes written today." title="Gratitude" value={String(todaysGratitude)}>
          <HeartIcon />
        </SummaryCard>
        <SummaryCard detail="Appointments scheduled today." title="Appointments" value={String(todaysAppointments)}>
          <CalendarCheckIcon />
        </SummaryCard>
      </section>

      <section className="section-card mt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="soft-label">Quick actions</p>
            <h2 className="mt-1 font-serif text-2xl font-bold text-luxury-text">Jump into any wellness moment</h2>
          </div>
          <PlusIcon className="hidden h-7 w-7 text-luxury-gold sm:block" />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map(({ href, label, icon: Icon }) => (
            <Link className="secondary-button justify-start px-5 py-4" href={href} key={href}>
              <Icon className="h-5 w-5 text-luxury-gold-light" />
              {label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
