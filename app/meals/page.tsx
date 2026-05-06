'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { PlusIcon, TrashIcon, UtensilsIcon } from '@/components/Icons';
import {
  Meal,
  MealType,
  STORAGE_KEYS,
  addToCollection,
  createId,
  deleteFromCollection,
  formatDisplayDate,
  getCollection,
  getNumberSetting,
  isSameDate,
  setNumberSetting,
  sortNewestByDate,
  todayInputValue
} from '@/lib/storage';

const mealTypes: MealType[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

const initialForm = {
  name: '',
  type: 'Breakfast' as MealType,
  calories: '',
  notes: '',
  date: todayInputValue()
};

export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [form, setForm] = useState(initialForm);
  const today = todayInputValue();

  useEffect(() => {
    setMeals(sortNewestByDate(getCollection<Meal>(STORAGE_KEYS.meals)));
    setCalorieGoal(getNumberSetting(STORAGE_KEYS.calorieGoal, 2000));
    setForm((current) => ({ ...current, date: todayInputValue() }));
  }, []);

  const todaysCalories = meals
    .filter((meal) => isSameDate(meal.date, today))
    .reduce((sum, meal) => sum + meal.calories, 0);
  const progress = Math.min(100, Math.round((todaysCalories / calorieGoal) * 100));

  const groupedMeals = useMemo(
    () =>
      mealTypes.map((type) => ({
        type,
        meals: meals.filter((meal) => meal.type === type)
      })),
    [meals]
  );

  function submitMeal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const calories = Number(form.calories);

    if (!form.name.trim() || !Number.isFinite(calories) || calories <= 0) {
      return;
    }

    const meal: Meal = {
      id: createId(),
      name: form.name.trim(),
      type: form.type,
      calories,
      notes: form.notes.trim(),
      date: form.date || todayInputValue(),
      createdAt: new Date().toISOString()
    };

    const nextMeals = addToCollection<Meal>(STORAGE_KEYS.meals, meal);
    setMeals(sortNewestByDate(nextMeals));
    setForm({ ...initialForm, date: todayInputValue() });
  }

  function updateGoal(value: string) {
    const nextGoal = Number(value);
    setCalorieGoal(nextGoal);

    if (Number.isFinite(nextGoal) && nextGoal > 0) {
      setNumberSetting(STORAGE_KEYS.calorieGoal, nextGoal);
    }
  }

  function deleteMeal(id: string) {
    setMeals(sortNewestByDate(deleteFromCollection<Meal>(STORAGE_KEYS.meals, id)));
  }

  return (
    <div className="page-shell">
      <section className="mb-8">
        <p className="soft-label text-blush-600">Meal and calorie log</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-950">Nourish the day</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Track meals gently with a daily calorie goal that can change whenever it needs to.
        </p>
      </section>

      <section className="mb-8 rounded-3xl border border-blush-100 bg-blush-50/70 p-5 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="soft-label text-blush-600">Today&apos;s calories</p>
            <p className="mt-2 text-4xl font-bold text-slate-950">
              {todaysCalories.toLocaleString()}
              <span className="ml-2 text-lg font-semibold text-slate-500">/ {calorieGoal.toLocaleString()}</span>
            </p>
          </div>
          <label className="grid gap-2 sm:w-48">
            <span className="soft-label">Daily goal</span>
            <input
              className="form-field bg-white"
              min="1"
              onChange={(event) => updateGoal(event.target.value)}
              type="number"
              value={calorieGoal}
            />
          </label>
        </div>
        <div className="mt-5 h-4 overflow-hidden rounded-full bg-white">
          <div
            className="h-full rounded-full bg-blush-300 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <form className="section-card h-fit" onSubmit={submitMeal}>
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blush-50 text-blush-500">
              <UtensilsIcon />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-950">New meal</h2>
              <p className="text-sm text-slate-500">Add a meal, snack, or little treat.</p>
            </div>
          </div>

          <div className="grid gap-4">
            <label className="grid gap-2">
              <span className="soft-label">Meal name</span>
              <input
                className="form-field"
                onChange={(event) => setForm((value) => ({ ...value, name: event.target.value }))}
                placeholder="Vegetable omelette"
                required
                value={form.name}
              />
            </label>

            <label className="grid gap-2">
              <span className="soft-label">Meal type</span>
              <select
                className="form-field"
                onChange={(event) => setForm((value) => ({ ...value, type: event.target.value as MealType }))}
                value={form.type}
              >
                {mealTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="soft-label">Calories</span>
                <input
                  className="form-field"
                  min="1"
                  onChange={(event) => setForm((value) => ({ ...value, calories: event.target.value }))}
                  placeholder="420"
                  required
                  type="number"
                  value={form.calories}
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
                className="form-field min-h-24 resize-y"
                onChange={(event) => setForm((value) => ({ ...value, notes: event.target.value }))}
                placeholder="Added extra herbs and lemon."
                value={form.notes}
              />
            </label>

            <button className="primary-button w-full" type="submit">
              <PlusIcon className="h-5 w-5" />
              Add Meal
            </button>
          </div>
        </form>

        <div className="grid gap-5">
          {meals.length === 0 ? (
            <div className="section-card text-center">
              <UtensilsIcon className="mx-auto h-10 w-10 text-blush-300" />
              <h2 className="mt-4 text-xl font-bold text-slate-950">No meals logged yet</h2>
              <p className="mt-2 text-sm text-slate-500">Breakfast, lunch, dinner, and snacks will gather here.</p>
            </div>
          ) : (
            groupedMeals.map(({ type, meals: typedMeals }) =>
              typedMeals.length > 0 ? (
                <section className="grid gap-3" key={type}>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-950">{type}</h2>
                    <span className="rounded-full bg-blush-50 px-3 py-1 text-xs font-bold text-blush-600">
                      {typedMeals.length}
                    </span>
                  </div>
                  {typedMeals.map((meal) => (
                    <article className="section-card" key={meal.id}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-2xl font-bold text-slate-950">{meal.name}</h3>
                          <p className="mt-2 text-sm font-semibold text-slate-500">
                            {meal.calories.toLocaleString()} calories · {formatDisplayDate(meal.date)}
                          </p>
                        </div>
                        <button
                          aria-label={`Delete ${meal.name}`}
                          className="danger-button shrink-0"
                          onClick={() => deleteMeal(meal.id)}
                          type="button"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                      {meal.notes ? <p className="mt-4 leading-7 text-slate-600">{meal.notes}</p> : null}
                    </article>
                  ))}
                </section>
              ) : null
            )
          )}
        </div>
      </section>
    </div>
  );
}
