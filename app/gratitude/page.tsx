'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { CalendarIcon, HeartIcon, PlusIcon, TrashIcon } from '@/components/Icons';
import {
  GratitudeEntry,
  STORAGE_KEYS,
  addToCollection,
  createId,
  deleteFromCollection,
  formatDisplayDate,
  getCollection,
  sortNewestByDate,
  todayInputValue
} from '@/lib/storage';

const gratitudeQuotes = [
  'A small moment of gratitude can shift the whole day.',
  'Notice the good, even if it was quiet.',
  'Write one thing that made today feel meaningful.',
  'Gratitude is a gentle way of returning to yourself.'
];

const initialForm = {
  date: todayInputValue(),
  note: ''
};

export default function GratitudePage() {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const quote = useMemo(() => {
    const dayIndex = new Date().getDate() % gratitudeQuotes.length;
    return gratitudeQuotes[dayIndex];
  }, []);

  useEffect(() => {
    setEntries(sortNewestByDate(getCollection<GratitudeEntry>(STORAGE_KEYS.gratitude)));
    setForm((current) => ({ ...current, date: todayInputValue() }));
  }, []);

  function submitEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.date) {
      setError('Choose a date for this gratitude note.');
      return;
    }

    if (!form.note.trim()) {
      setError('Write one small thing you are grateful for.');
      return;
    }

    const entry: GratitudeEntry = {
      id: createId(),
      date: form.date,
      note: form.note.trim(),
      createdAt: new Date().toISOString()
    };

    const nextEntries = addToCollection<GratitudeEntry>(STORAGE_KEYS.gratitude, entry);
    setEntries(sortNewestByDate(nextEntries));
    setForm({ ...initialForm, date: todayInputValue() });
    setError('');
  }

  function deleteEntry(id: string) {
    setEntries(sortNewestByDate(deleteFromCollection<GratitudeEntry>(STORAGE_KEYS.gratitude, id)));
  }

  return (
    <div className="page-shell">
      <section className="mb-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <p className="soft-label text-luxury-gold-light">Daily reflection</p>
          <h1 className="mt-2 font-serif text-4xl font-bold text-luxury-text">Gratitude of the Day</h1>
          <p className="mt-3 max-w-2xl text-luxury-muted">
            Take a quiet moment to notice what felt good today.
          </p>
        </div>

        <aside className="section-card section-card-hover">
          <p className="soft-label text-luxury-gold-light">A gentle reminder</p>
          <p className="mt-3 font-serif text-2xl font-semibold leading-9 text-luxury-text">&ldquo;{quote}&rdquo;</p>
        </aside>
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="grid content-start gap-6">
          <article className="section-card section-card-hover">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-luxury-line bg-luxury-gold/10 text-luxury-gold-light">
                <CalendarIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="soft-label">Today</p>
                <p className="mt-1 font-serif text-2xl font-bold text-luxury-text">
                  {formatDisplayDate(todayInputValue())}
                </p>
              </div>
            </div>
            <p className="mt-5 leading-7 text-luxury-muted">
              Write one thing that made today feel meaningful. It can be big, tiny, quiet, or ordinary.
            </p>
          </article>

          <form className="section-card" onSubmit={submitEntry}>
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-luxury-line bg-luxury-gold/10 text-luxury-gold-light">
                <HeartIcon />
              </span>
              <div>
                <h2 className="font-serif text-xl font-bold text-luxury-text">Today&apos;s gratitude</h2>
                <p className="text-sm text-luxury-muted">A peaceful space for one thoughtful note.</p>
              </div>
            </div>

            <div className="grid gap-4">
              <label className="grid gap-2">
                <span className="soft-label">Date</span>
                <input
                  className="form-field"
                  onChange={(event) => setForm((value) => ({ ...value, date: event.target.value }))}
                  required
                  type="date"
                  value={form.date}
                />
              </label>

              <label className="grid gap-2">
                <span className="soft-label">Reflection</span>
                <textarea
                  className="form-field min-h-44 resize-y text-base leading-7"
                  onChange={(event) => setForm((value) => ({ ...value, note: event.target.value }))}
                  placeholder="Today, I'm grateful for..."
                  value={form.note}
                />
              </label>

              {error ? (
                <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
                  {error}
                </p>
              ) : null}

              <button className="primary-button w-full" type="submit">
                <PlusIcon className="h-5 w-5" />
                Save Entry
              </button>
            </div>
          </form>
        </div>

        <section className="section-card">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="soft-label">Recent entries</p>
              <h2 className="mt-1 font-serif text-2xl font-bold text-luxury-text">Moments worth remembering</h2>
            </div>
            <span className="gold-badge">{entries.length} saved</span>
          </div>

          <div className="grid gap-4">
            {entries.length === 0 ? (
              <div className="rounded-lg border border-dashed border-luxury-line bg-black/20 p-8 text-center">
                <HeartIcon className="mx-auto h-10 w-10 text-luxury-gold" />
                <h3 className="mt-4 font-serif text-xl font-bold text-luxury-text">No gratitude saved yet</h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-luxury-muted">
                  Save your first note and this space will become a gentle record of good moments.
                </p>
              </div>
            ) : (
              entries.map((entry) => (
                <article className="section-card section-card-hover bg-black/20" key={entry.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="gold-badge">{formatDisplayDate(entry.date)}</span>
                      <p className="mt-4 whitespace-pre-line text-base leading-7 text-luxury-text">{entry.note}</p>
                    </div>
                    <button
                      aria-label={`Delete gratitude entry for ${formatDisplayDate(entry.date)}`}
                      className="danger-button shrink-0"
                      onClick={() => deleteEntry(entry.id)}
                      type="button"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </section>
    </div>
  );
}
