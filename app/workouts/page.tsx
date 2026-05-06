'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { CalendarIcon, DumbbellIcon, PlusIcon, TrashIcon } from '@/components/Icons';
import {
  STORAGE_KEYS,
  Workout,
  WorkoutCategory,
  addToCollection,
  createId,
  deleteFromCollection,
  formatDisplayDate,
  getCollection,
  isDateThisWeek,
  sortNewestByDate,
  todayInputValue
} from '@/lib/storage';

const categories: WorkoutCategory[] = [
  'Cardio',
  'Strength/Weights',
  'Yoga/Stretching',
  'Home Bodyweight',
  'Other'
];

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

  useEffect(() => {
    setWorkouts(sortNewestByDate(getCollection<Workout>(STORAGE_KEYS.workouts)));
    setForm((current) => ({ ...current, date: todayInputValue() }));
  }, []);

  const weeklyWorkouts = useMemo(
    () => workouts.filter((workout) => isDateThisWeek(workout.date)),
    [workouts]
  );
  const weeklyMinutes = weeklyWorkouts.reduce((sum, workout) => sum + workout.duration, 0);

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
          <p className="soft-label text-blush-600">Workout tracker</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-950">Log today&apos;s movement</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Gentle walks, strong lifts, yoga stretches, and everything in between all count here.
          </p>
        </div>
      </section>

      <section className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="section-card bg-blush-50/80">
          <p className="soft-label text-blush-600">This week</p>
          <p className="mt-2 text-4xl font-bold text-slate-950">{weeklyWorkouts.length}</p>
          <p className="mt-1 text-sm text-slate-600">total workouts</p>
        </div>
        <div className="section-card bg-white">
          <p className="soft-label">Total minutes</p>
          <p className="mt-2 text-4xl font-bold text-slate-950">{weeklyMinutes}</p>
          <p className="mt-1 text-sm text-slate-600">minutes of care this week</p>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <form className="section-card h-fit" onSubmit={submitWorkout}>
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blush-50 text-blush-500">
              <DumbbellIcon />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-950">New workout</h2>
              <p className="text-sm text-slate-500">Save the session while it is fresh.</p>
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
              <DumbbellIcon className="mx-auto h-10 w-10 text-blush-300" />
              <h2 className="mt-4 text-xl font-bold text-slate-950">No workouts yet</h2>
              <p className="mt-2 text-sm text-slate-500">The first one will look lovely here.</p>
            </div>
          ) : (
            workouts.map((workout) => (
              <article className="section-card transition hover:-translate-y-0.5 hover:shadow-soft" key={workout.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-flex rounded-full bg-blush-50 px-3 py-1 text-xs font-bold text-blush-600">
                      {workout.category}
                    </span>
                    <h2 className="mt-3 text-2xl font-bold text-slate-950">{workout.name}</h2>
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

                <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 font-semibold">
                    <DumbbellIcon className="h-4 w-4 text-blush-500" />
                    {workout.duration} minutes
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 font-semibold">
                    <CalendarIcon className="h-4 w-4 text-blush-500" />
                    {formatDisplayDate(workout.date)}
                  </span>
                </div>

                {workout.notes ? <p className="mt-4 leading-7 text-slate-600">{workout.notes}</p> : null}
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
