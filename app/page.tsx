'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  BookIcon,
  DumbbellIcon,
  HeartIcon,
  PlusIcon,
  TargetIcon,
  UtensilsIcon
} from '@/components/Icons';
import { getDailyQuote } from '@/lib/quotes';
import {
  Goal,
  Meal,
  STORAGE_KEYS,
  Workout,
  getCollection,
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
    <article className="section-card transition duration-200 hover:-translate-y-1 hover:shadow-soft">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blush-50 text-blush-500">
        {children}
      </div>
      <p className="soft-label">{title}</p>
      <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{detail}</p>
    </article>
  );
}

export default function Home() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const today = todayInputValue();
  const quote = useMemo(() => getDailyQuote(), []);

  useEffect(() => {
    setWorkouts(getCollection<Workout>(STORAGE_KEYS.workouts));
    setMeals(getCollection<Meal>(STORAGE_KEYS.meals));
    setGoals(getCollection<Goal>(STORAGE_KEYS.goals));
  }, []);

  const todaysWorkouts = workouts.filter((workout) => isSameDate(workout.date, today));
  const todaysCalories = meals
    .filter((meal) => isSameDate(meal.date, today))
    .reduce((sum, meal) => sum + meal.calories, 0);
  const activeGoals = goals.filter((goal) => goal.status === 'In Progress').length;

  const quickLinks = [
    { href: '/workouts', label: 'Log Workout', icon: DumbbellIcon },
    { href: '/meals', label: 'Add Meal', icon: UtensilsIcon },
    { href: '/recipes', label: 'Find Recipe', icon: BookIcon },
    { href: '/goals', label: 'Set Goal', icon: TargetIcon }
  ];

  return (
    <div className="page-shell">
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-blush-50 px-4 py-2 text-sm font-bold text-blush-600">
            <HeartIcon className="h-4 w-4" />
            Made with love by Alux
          </div>
          <h1 className="text-balance text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
            Welcome back, Sukhi 💕
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            A calm place to log movement, nourish the day, collect recipes, and celebrate every milestone.
          </p>
        </div>

        <aside className="rounded-3xl border border-blush-100 bg-blush-50/70 p-6 shadow-soft">
          <p className="soft-label text-blush-600">Today&apos;s quote</p>
          <p className="mt-4 text-2xl font-semibold leading-9 text-slate-900">&ldquo;{quote}&rdquo;</p>
        </aside>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          detail={todaysWorkouts.length === 1 ? 'One beautiful session today.' : 'Sessions recorded for today.'}
          title="Workouts logged"
          value={String(todaysWorkouts.length)}
        >
          <DumbbellIcon />
        </SummaryCard>
        <SummaryCard detail="Calories logged for today." title="Calories consumed" value={todaysCalories.toLocaleString()}>
          <UtensilsIcon />
        </SummaryCard>
        <SummaryCard detail="Goals still moving forward." title="Active goals" value={String(activeGoals)}>
          <TargetIcon />
        </SummaryCard>
        <SummaryCard detail="A fresh thought rotates daily." title="Motivation" value="Daily">
          <HeartIcon />
        </SummaryCard>
      </section>

      <section className="mt-10 rounded-3xl border border-slate-100 bg-white p-5 shadow-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="soft-label">Quick add</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-950">Jump into any wellness moment</h2>
          </div>
          <PlusIcon className="hidden h-7 w-7 text-blush-400 sm:block" />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map(({ href, label, icon: Icon }) => (
            <Link className="secondary-button justify-start px-5 py-4" href={href} key={href}>
              <Icon className="h-5 w-5 text-blush-500" />
              {label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
