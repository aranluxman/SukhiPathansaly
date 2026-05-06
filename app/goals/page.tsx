'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { CheckIcon, EditIcon, PlusIcon, TargetIcon, TrashIcon } from '@/components/Icons';
import {
  Goal,
  GoalCategory,
  GoalStatus,
  STORAGE_KEYS,
  addToCollection,
  createId,
  deleteFromCollection,
  formatDisplayDate,
  getCollection,
  todayInputValue,
  updateInCollection
} from '@/lib/storage';

const categories: GoalCategory[] = ['Fitness', 'Nutrition', 'Wellness', 'Personal', 'Other'];

const initialForm = {
  title: '',
  category: 'Fitness' as GoalCategory,
  description: '',
  targetDate: '',
  status: 'In Progress' as GoalStatus
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setGoals(getCollection<Goal>(STORAGE_KEYS.goals));
  }, []);

  const completedCount = goals.filter((goal) => goal.status === 'Completed').length;
  const { inProgressGoals, completedGoals } = useMemo(() => {
    const ordered = [...goals].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return {
      inProgressGoals: ordered.filter((goal) => goal.status === 'In Progress'),
      completedGoals: ordered.filter((goal) => goal.status === 'Completed')
    };
  }, [goals]);

  function submitGoal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.title.trim()) {
      return;
    }

    if (editingId) {
      const nextGoals = updateInCollection<Goal>(STORAGE_KEYS.goals, editingId, (goal) => ({
        ...goal,
        title: form.title.trim(),
        category: form.category,
        description: form.description.trim(),
        targetDate: form.targetDate,
        status: form.status,
        completedAt: form.status === 'Completed' ? goal.completedAt ?? new Date().toISOString() : undefined
      }));
      setGoals(nextGoals);
      setEditingId(null);
      setForm(initialForm);
      return;
    }

    const goal: Goal = {
      id: createId(),
      title: form.title.trim(),
      category: form.category,
      description: form.description.trim(),
      targetDate: form.targetDate,
      status: form.status,
      createdAt: new Date().toISOString(),
      completedAt: form.status === 'Completed' ? new Date().toISOString() : undefined
    };

    setGoals(addToCollection<Goal>(STORAGE_KEYS.goals, goal));
    setForm(initialForm);
  }

  function startEdit(goal: Goal) {
    setEditingId(goal.id);
    setForm({
      title: goal.title,
      category: goal.category,
      description: goal.description ?? '',
      targetDate: goal.targetDate ?? '',
      status: goal.status
    });
  }

  function completeGoal(goal: Goal) {
    const nextGoals = updateInCollection<Goal>(STORAGE_KEYS.goals, goal.id, (item) => ({
      ...item,
      status: 'Completed',
      completedAt: new Date().toISOString()
    }));
    setGoals(nextGoals);
  }

  function deleteGoal(id: string) {
    const nextGoals = deleteFromCollection<Goal>(STORAGE_KEYS.goals, id);
    setGoals(nextGoals);

    if (editingId === id) {
      setEditingId(null);
      setForm(initialForm);
    }
  }

  function toggleStatus(status: GoalStatus) {
    setForm((value) => ({ ...value, status }));
  }

  function resetForm() {
    setEditingId(null);
    setForm(initialForm);
  }

  function renderGoal(goal: Goal) {
    const completed = goal.status === 'Completed';

    return (
      <article className="section-card transition hover:-translate-y-0.5 hover:shadow-soft" key={goal.id}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                completed ? 'bg-emerald-50 text-emerald-700' : 'bg-yellow-50 text-yellow-700'
              }`}
            >
              {completed ? '✓ Completed' : 'In Progress'}
            </span>
            <h3
              className={`mt-3 text-2xl font-bold text-slate-950 ${
                completed ? 'text-slate-400 line-through decoration-blush-300 decoration-2' : ''
              }`}
            >
              {goal.title}
            </h3>
            <p className="mt-2 text-sm font-semibold text-slate-500">
              {goal.category}
              {goal.targetDate ? ` · Target ${formatDisplayDate(goal.targetDate)}` : ''}
            </p>
          </div>

          <div className="flex gap-2">
            {!completed ? (
              <button
                aria-label={`Mark ${goal.title} as complete`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-100 bg-white text-emerald-600 transition hover:bg-emerald-50"
                onClick={() => completeGoal(goal)}
                type="button"
              >
                <CheckIcon className="h-4 w-4" />
              </button>
            ) : null}
            <button
              aria-label={`Edit ${goal.title}`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-blush-100 bg-white text-blush-500 transition hover:bg-blush-50"
              onClick={() => startEdit(goal)}
              type="button"
            >
              <EditIcon className="h-4 w-4" />
            </button>
            <button
              aria-label={`Delete ${goal.title}`}
              className="danger-button"
              onClick={() => deleteGoal(goal.id)}
              type="button"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {goal.description ? <p className="mt-4 leading-7 text-slate-600">{goal.description}</p> : null}
      </article>
    );
  }

  return (
    <div className="page-shell">
      <section className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="soft-label text-blush-600">Goals and milestones</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-950">Celebrate every step</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Set intentions, track progress, and keep completed wins where they can be seen.
          </p>
        </div>
        <div className="rounded-3xl border border-blush-100 bg-blush-50 px-5 py-4 text-center shadow-soft">
          <p className="text-3xl font-bold text-slate-950">{completedCount}</p>
          <p className="text-sm font-semibold text-blush-600">goals completed 🎉</p>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <form className="section-card h-fit" onSubmit={submitGoal}>
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blush-50 text-blush-500">
              <TargetIcon />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-950">{editingId ? 'Edit goal' : 'New goal'}</h2>
              <p className="text-sm text-slate-500">Make the next milestone feel reachable.</p>
            </div>
          </div>

          <div className="grid gap-4">
            <label className="grid gap-2">
              <span className="soft-label">Title</span>
              <input
                className="form-field"
                onChange={(event) => setForm((value) => ({ ...value, title: event.target.value }))}
                placeholder="Walk three times this week"
                required
                value={form.title}
              />
            </label>

            <label className="grid gap-2">
              <span className="soft-label">Category</span>
              <select
                className="form-field"
                onChange={(event) =>
                  setForm((value) => ({ ...value, category: event.target.value as GoalCategory }))
                }
                value={form.category}
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="soft-label">Description</span>
              <textarea
                className="form-field min-h-24 resize-y"
                onChange={(event) => setForm((value) => ({ ...value, description: event.target.value }))}
                placeholder="A note about why this matters."
                value={form.description}
              />
            </label>

            <label className="grid gap-2">
              <span className="soft-label">Target date</span>
              <input
                className="form-field"
                min={todayInputValue()}
                onChange={(event) => setForm((value) => ({ ...value, targetDate: event.target.value }))}
                type="date"
                value={form.targetDate}
              />
            </label>

            <div className="grid gap-2">
              <span className="soft-label">Status</span>
              <div className="grid grid-cols-2 rounded-2xl bg-slate-50 p-1">
                {(['In Progress', 'Completed'] as GoalStatus[]).map((status) => (
                  <button
                    className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
                      form.status === status ? 'bg-white text-blush-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                    }`}
                    key={status}
                    onClick={() => toggleStatus(status)}
                    type="button"
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <button className="primary-button w-full" type="submit">
              <PlusIcon className="h-5 w-5" />
              {editingId ? 'Save Goal' : 'Add Goal'}
            </button>

            {editingId ? (
              <button className="secondary-button w-full" onClick={resetForm} type="button">
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>

        <div className="grid gap-7">
          <section className="grid gap-3">
            <h2 className="text-xl font-bold text-slate-950">In Progress</h2>
            {inProgressGoals.length > 0 ? (
              inProgressGoals.map(renderGoal)
            ) : (
              <div className="section-card text-center text-sm font-semibold text-slate-500">
                No active goals yet.
              </div>
            )}
          </section>

          <section className="grid gap-3">
            <h2 className="text-xl font-bold text-slate-950">Completed</h2>
            {completedGoals.length > 0 ? (
              completedGoals.map(renderGoal)
            ) : (
              <div className="section-card text-center text-sm font-semibold text-slate-500">
                Completed milestones will show up here.
              </div>
            )}
          </section>
        </div>
      </section>
    </div>
  );
}
