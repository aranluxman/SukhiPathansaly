'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  BookIcon,
  CalendarCheckIcon,
  DumbbellIcon,
  HeartIcon,
  ListIcon,
  MessageIcon,
  MoonIcon,
  PlusIcon,
  TargetIcon,
  UtensilsIcon
} from '@/components/Icons';
import { getDailyQuote } from '@/lib/quotes';
import {
  Goal,
  Appointment,
  Meal,
  STORAGE_KEYS,
  SleepLog,
  TaskList,
  Workout,
  getCollection,
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
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const today = todayInputValue();
  const quote = useMemo(() => getDailyQuote(), []);

  useEffect(() => {
    setWorkouts(getCollection<Workout>(STORAGE_KEYS.workouts));
    setMeals(getCollection<Meal>(STORAGE_KEYS.meals));
    setGoals(getCollection<Goal>(STORAGE_KEYS.goals));
    setTaskLists(getTaskLists());
    setSleepLogs(getCollection<SleepLog>(STORAGE_KEYS.sleep));
    setAppointments(getCollection<Appointment>(STORAGE_KEYS.appointments));
  }, []);

  const todaysWorkouts = workouts.filter((workout) => isSameDate(workout.date, today));
  const todaysCalories = meals
    .filter((meal) => isSameDate(meal.date, today))
    .reduce((sum, meal) => sum + meal.calories, 0);
  const activeGoals = goals.filter((goal) => goal.status === 'In Progress').length;
  const pendingTasks = taskLists.reduce(
    (sum, list) => sum + list.tasks.filter((task) => !task.completed).length,
    0
  );
  const lastNightSleep = sleepLogs.find((log) => log.date === today)?.hours;
  const todaysAppointments = appointments.filter((appointment) => appointment.date === today).length;

  const quickLinks = [
    { href: '/workouts', label: 'Log Workout', icon: DumbbellIcon },
    { href: '/meals', label: 'Add Meal', icon: UtensilsIcon },
    { href: '/recipes', label: 'Find Recipes', icon: BookIcon },
    { href: '/goals', label: 'Set Goal', icon: TargetIcon },
    { href: '/tasks', label: 'Open Tasks', icon: ListIcon },
    { href: '/sleep', label: 'Log Sleep', icon: MoonIcon },
    { href: '/appointments', label: 'Appointments', icon: CalendarCheckIcon },
    { href: '/chat', label: 'Wellness Chat', icon: MessageIcon }
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
            A calm, polished space to track movement, meals, recipes, goals, tasks, and little moments of care.
          </p>
        </div>

        <aside className="section-card section-card-hover">
          <p className="soft-label text-luxury-gold-light">Today&apos;s quote</p>
          <p className="mt-4 font-serif text-2xl font-semibold leading-9 text-luxury-text">&ldquo;{quote}&rdquo;</p>
        </aside>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          detail={todaysWorkouts.length === 1 ? 'One beautiful session today.' : 'Sessions recorded for today.'}
          title="Workouts logged"
          value={String(todaysWorkouts.length)}
        >
          <DumbbellIcon />
        </SummaryCard>
        <SummaryCard detail="Calories logged for today." title="Calories today" value={todaysCalories.toLocaleString()}>
          <UtensilsIcon />
        </SummaryCard>
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
        <SummaryCard
          detail="Appointments scheduled today."
          title="Appointments"
          value={String(todaysAppointments)}
        >
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
