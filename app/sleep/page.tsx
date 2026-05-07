'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CalendarIcon, MoonIcon, PlusIcon, TrashIcon } from '@/components/Icons';
import {
  STORAGE_KEYS,
  SleepLog,
  SleepQuality,
  addToCollection,
  createId,
  deleteFromCollection,
  formatDisplayDate,
  formatShortDate,
  getCollection,
  getLastNDays,
  sortNewestByDate,
  todayInputValue
} from '@/lib/storage';

const qualities: SleepQuality[] = ['Great', 'Good', 'Okay', 'Poor'];

const initialForm = {
  date: todayInputValue(),
  hours: '',
  quality: 'Good' as SleepQuality,
  notes: ''
};

export default function SleepPage() {
  const [logs, setLogs] = useState<SleepLog[]>([]);
  const [form, setForm] = useState(initialForm);
  const [chartReady, setChartReady] = useState(false);

  useEffect(() => {
    setLogs(sortNewestByDate(getCollection<SleepLog>(STORAGE_KEYS.sleep)));
    setForm((current) => ({ ...current, date: todayInputValue() }));
    setChartReady(true);
  }, []);

  const chartData = useMemo(
    () =>
      getLastNDays(7).map((date) => {
        const dayLogs = logs.filter((log) => log.date === date);
        const hours = dayLogs.reduce((sum, log) => sum + log.hours, 0);

        return {
          date,
          label: formatShortDate(date),
          hours: Number(hours.toFixed(1)),
          quality: dayLogs[0]?.quality ?? 'Not logged'
        };
      }),
    [logs]
  );

  const weekLogs = useMemo(() => {
    const days = new Set(getLastNDays(7));
    return logs.filter((log) => days.has(log.date));
  }, [logs]);

  const totalHours = weekLogs.reduce((sum, log) => sum + log.hours, 0);
  const averageHours = weekLogs.length ? totalHours / weekLogs.length : 0;
  const bestQualityCount = weekLogs.filter((log) => log.quality === 'Great' || log.quality === 'Good').length;

  function submitSleep(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const hours = Number(form.hours);

    if (!Number.isFinite(hours) || hours <= 0 || hours > 24) {
      return;
    }

    const log: SleepLog = {
      id: createId(),
      date: form.date || todayInputValue(),
      hours,
      quality: form.quality,
      notes: form.notes.trim(),
      createdAt: new Date().toISOString()
    };

    const nextLogs = addToCollection<SleepLog>(STORAGE_KEYS.sleep, log);
    setLogs(sortNewestByDate(nextLogs));
    setForm({ ...initialForm, date: todayInputValue() });
  }

  function deleteLog(id: string) {
    setLogs(sortNewestByDate(deleteFromCollection<SleepLog>(STORAGE_KEYS.sleep, id)));
  }

  return (
    <div className="page-shell">
      <section className="mb-8">
        <p className="soft-label text-luxury-gold-light">Sleep log</p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-luxury-text">Track rest and recovery</h1>
        <p className="mt-3 max-w-2xl text-luxury-muted">
          Record sleep hours and quality each night so patterns become easy to see over the week.
        </p>
      </section>

      <section className="section-card mb-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="soft-label">Average sleep</p>
            <p className="mt-2 text-4xl font-bold text-luxury-text">{averageHours.toFixed(1)}h</p>
            <p className="mt-1 text-sm text-luxury-muted">per logged night this week</p>
          </div>
          <div>
            <p className="soft-label">Nights logged</p>
            <p className="mt-2 text-4xl font-bold text-luxury-text">{weekLogs.length}</p>
            <p className="mt-1 text-sm text-luxury-muted">entries in the last seven days</p>
          </div>
          <div>
            <p className="soft-label">Good quality</p>
            <p className="mt-2 text-4xl font-bold text-luxury-text">{bestQualityCount}</p>
            <p className="mt-1 text-sm text-luxury-muted">Great or Good nights</p>
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
                        <p className="text-luxury-text">{payload[0].value} hours</p>
                        <p className="text-luxury-muted">Quality: {payload[0].payload.quality}</p>
                      </div>
                    ) : null
                  }
                  cursor={{ fill: 'rgba(201,168,76,0.08)' }}
                />
                <Bar dataKey="hours" fill="#c9a84c" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : null}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <form className="section-card h-fit" onSubmit={submitSleep}>
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-luxury-line bg-luxury-gold/10 text-luxury-gold-light">
              <MoonIcon />
            </span>
            <div>
              <h2 className="font-serif text-xl font-bold text-luxury-text">New sleep entry</h2>
              <p className="text-sm text-luxury-muted">A simple nightly check-in.</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="soft-label">Date</span>
                <input
                  className="form-field"
                  onChange={(event) => setForm((value) => ({ ...value, date: event.target.value }))}
                  type="date"
                  value={form.date}
                />
              </label>
              <label className="grid gap-2">
                <span className="soft-label">Hours</span>
                <input
                  className="form-field"
                  max="24"
                  min="0.25"
                  onChange={(event) => setForm((value) => ({ ...value, hours: event.target.value }))}
                  placeholder="7.5"
                  required
                  step="0.25"
                  type="number"
                  value={form.hours}
                />
              </label>
            </div>

            <label className="grid gap-2">
              <span className="soft-label">Sleep quality</span>
              <select
                className="form-field"
                onChange={(event) => setForm((value) => ({ ...value, quality: event.target.value as SleepQuality }))}
                value={form.quality}
              >
                {qualities.map((quality) => (
                  <option key={quality}>{quality}</option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="soft-label">Notes</span>
              <textarea
                className="form-field min-h-28 resize-y"
                onChange={(event) => setForm((value) => ({ ...value, notes: event.target.value }))}
                placeholder="Fell asleep quickly, woke once, felt rested."
                value={form.notes}
              />
            </label>

            <button className="primary-button w-full" type="submit">
              <PlusIcon className="h-5 w-5" />
              Add Sleep Log
            </button>
          </div>
        </form>

        <div className="grid content-start gap-4">
          {logs.length === 0 ? (
            <div className="section-card text-center">
              <MoonIcon className="mx-auto h-10 w-10 text-luxury-gold" />
              <h2 className="mt-4 font-serif text-xl font-bold text-luxury-text">No sleep logged yet</h2>
              <p className="mt-2 text-sm text-luxury-muted">Her nightly entries will appear here.</p>
            </div>
          ) : (
            logs.map((log) => (
              <article className="section-card section-card-hover" key={log.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="gold-badge">{log.quality}</span>
                    <h3 className="mt-3 font-serif text-2xl font-bold text-luxury-text">{log.hours} hours</h3>
                    <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-luxury-muted">
                      <CalendarIcon className="h-4 w-4 text-luxury-gold-light" />
                      {formatDisplayDate(log.date)}
                    </p>
                  </div>
                  <button
                    aria-label={`Delete sleep log for ${formatDisplayDate(log.date)}`}
                    className="danger-button shrink-0"
                    onClick={() => deleteLog(log.id)}
                    type="button"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
                {log.notes ? <p className="mt-4 leading-7 text-luxury-muted">{log.notes}</p> : null}
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
