'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CalendarIcon, DumbbellIcon, PlusIcon, TrashIcon } from '@/components/Icons';
import {
  STORAGE_KEYS,
  Workout,
  WorkoutCategory,
  addToCollection,
  createId,
  deleteFromCollection,
  formatDisplayDate,
  formatShortDate,
  getCollection,
  getLastNDays,
  isDateThisWeek,
  sortNewestByDate,
  todayInputValue
} from '@/lib/storage';

const categories: WorkoutCategory[] = ['Cardio', 'Strength', 'Yoga', 'Bodyweight', 'Other'];

const initialForm = {
  name: '',
  category: 'Cardio' as WorkoutCategory,
  duration: '',
  notes: '',
  date: todayInputValue()
};

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [form, setForm] = useState(initialForm);
  const [chartReady, setChartReady] = useState(false);

  useEffect(() => {
    setWorkouts(sortNewestByDate(getCollection<Workout>(STORAGE_KEYS.workouts)));
    setForm((current) => ({ ...current, date: todayInputValue() }));
    setChartReady(true);
  }, []);

  const weeklyWorkouts = useMemo(
    () => workouts.filter((workout) => isDateThisWeek(workout.date)),
    [workouts]
  );
  const weeklyMinutes = weeklyWorkouts.reduce((sum, workout) => sum + workout.duration, 0);

  const chartData = useMemo(
    () =>
      getLastNDays(7).map((date) => ({
        date,
        label: formatShortDate(date),
        minutes: workouts
          .filter((workout) => workout.date === date)
          .reduce((sum, workout) => sum + workout.duration, 0)
      })),
    [workouts]
  );

  function submitWorkout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const duration = Number(form.duration);

    if (!form.name.trim() || !Number.isFinite(duration) || duration <= 0) {
      return;
    }

    const workout: Workout = {
      id: createId(),
      name: form.name.trim(),
      category: form.category,
      duration,
      notes: form.notes.trim(),
      date: form.date || todayInputValue(),
      createdAt: new Date().toISOString()
    };

    const nextWorkouts = addToCollection<Workout>(STORAGE_KEYS.workouts, workout);
    setWorkouts(sortNewestByDate(nextWorkouts));
    setForm({ ...initialForm, date: todayInputValue() });
  }

  function deleteWorkout(id: string) {
    setWorkouts(sortNewestByDate(deleteFromCollection<Workout>(STORAGE_KEYS.workouts, id)));
  }

  return (
    <div className="page-shell">
      <section className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="soft-label text-luxury-gold-light">Workout tracker</p>
          <h1 className="mt-2 font-serif text-4xl font-bold text-luxury-text">Log today&apos;s movement</h1>
          <p className="mt-3 max-w-2xl text-luxury-muted">
            Gentle walks, strong lifts, yoga stretches, and everything in between all count here.
          </p>
        </div>
      </section>

      <section className="section-card mb-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="soft-label">This week</p>
            <p className="mt-2 text-4xl font-bold text-luxury-text">{weeklyWorkouts.length}</p>
            <p className="mt-1 text-sm text-luxury-muted">total workouts</p>
          </div>
          <div>
            <p className="soft-label">Total minutes</p>
            <p className="mt-2 text-4xl font-bold text-luxury-text">{weeklyMinutes}</p>
            <p className="mt-1 text-sm text-luxury-muted">minutes of care this week</p>
          </div>
        </div>

        <div className="mt-8 h-72 rounded-lg border border-luxury-line bg-black/25 p-4">
          {chartReady ? (
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={chartData} margin={{ bottom: 8, left: -18, right: 8, top: 12 }}>
                <CartesianGrid stroke="#242424" strokeDasharray="3 3" vertical={false} />
                <XAxis axisLine={false} dataKey="label" tick={{ fill: '#888888', fontSize: 12 }} tickLine={false} />
                <YAxis axisLine={false} tick={{ fill: '#888888', fontSize: 12 }} tickLine={false} />
                <Tooltip
                  content={({ active, payload, label }) =>
                    active && payload?.length ? (
                      <div className="rounded-lg border border-luxury-line bg-luxury-card px-3 py-2 text-sm shadow-gold">
                        <p className="font-bold text-luxury-gold-light">{label}</p>
                        <p className="text-luxury-text">{payload[0].value} minutes</p>
                      </div>
                    ) : null
                  }
                  cursor={{ fill: 'rgba(201,168,76,0.08)' }}
                />
                <Bar dataKey="minutes" fill="#c9a84c" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : null}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <form className="section-card h-fit" onSubmit={submitWorkout}>
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-luxury-line bg-luxury-gold/10 text-luxury-gold-light">
              <DumbbellIcon />
            </span>
            <div>
              <h2 className="font-serif text-xl font-bold text-luxury-text">New workout</h2>
              <p className="text-sm text-luxury-muted">Save the session while it is fresh.</p>
            </div>
          </div>

          <div className="grid gap-4">
            <label className="grid gap-2">
              <span className="soft-label">Workout name</span>
              <input
                className="form-field"
                onChange={(event) => setForm((value) => ({ ...value, name: event.target.value }))}
                placeholder="Morning walk"
                required
                value={form.name}
              />
            </label>

            <label className="grid gap-2">
              <span className="soft-label">Category</span>
              <select
                className="form-field"
                onChange={(event) =>
                  setForm((value) => ({ ...value, category: event.target.value as WorkoutCategory }))
                }
                value={form.category}
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="soft-label">Duration</span>
                <input
                  className="form-field"
                  min="1"
                  onChange={(event) => setForm((value) => ({ ...value, duration: event.target.value }))}
                  placeholder="30"
                  required
                  type="number"
                  value={form.duration}
                />
              </label>

              <label className="grid gap-2">
                <span className="soft-label">Date</span>
                <input
                  className="form-field"
                  onChange={(event) => setForm((value) => ({ ...value, date: event.target.value }))}
                  type="date"
                  value={form.date}
                />
              </label>
            </div>

            <label className="grid gap-2">
              <span className="soft-label">Notes</span>
              <textarea
                className="form-field min-h-28 resize-y"
                onChange={(event) => setForm((value) => ({ ...value, notes: event.target.value }))}
                placeholder="Felt energized after stretching."
                value={form.notes}
              />
            </label>

            <button className="primary-button w-full" type="submit">
              <PlusIcon className="h-5 w-5" />
              Add Workout
            </button>
          </div>
        </form>

        <div className="grid gap-4">
          {workouts.length === 0 ? (
            <div className="section-card text-center">
              <DumbbellIcon className="mx-auto h-10 w-10 text-luxury-gold" />
              <h2 className="mt-4 font-serif text-xl font-bold text-luxury-text">No workouts yet</h2>
              <p className="mt-2 text-sm text-luxury-muted">The first one will look beautiful here.</p>
            </div>
          ) : (
            workouts.map((workout) => (
              <article className="section-card section-card-hover" key={workout.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="gold-badge">{workout.category}</span>
                    <h2 className="mt-3 font-serif text-2xl font-bold text-luxury-text">{workout.name}</h2>
                  </div>
                  <button
                    aria-label={`Delete ${workout.name}`}
                    className="danger-button shrink-0"
                    onClick={() => deleteWorkout(workout.id)}
                    type="button"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-5 flex flex-wrap gap-3 text-sm text-luxury-muted">
                  <span className="inline-flex items-center gap-2 rounded-full border border-luxury-line bg-black/25 px-3 py-1.5 font-semibold">
                    <DumbbellIcon className="h-4 w-4 text-luxury-gold-light" />
                    {workout.duration} minutes
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-luxury-line bg-black/25 px-3 py-1.5 font-semibold">
                    <CalendarIcon className="h-4 w-4 text-luxury-gold-light" />
                    {formatDisplayDate(workout.date)}
                  </span>
                </div>

                {workout.notes ? <p className="mt-4 leading-7 text-luxury-muted">{workout.notes}</p> : null}
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
