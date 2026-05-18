export const STORAGE_KEYS = {
  workouts: 'sukhi_workouts',
  meals: 'sukhi_meals',
  recipes: 'sukhi_recipes',
  goals: 'sukhi_goals',
  tasks: 'sukhi_tasks',
  sleep: 'sukhi_sleep',
  gratitude: 'sukhi_gratitude',
  frenchPractice: 'sukhi_french_practice',
  appointments: 'sukhi_appointments',
  appointmentSeedVersion: 'sukhi_appointment_seed_version',
  calorieGoal: 'sukhi_calorie_goal',
  welcomeSeen: 'sukhi_welcome_seen'
} as const;

export const CLOUD_COLLECTIONS = {
  recipes: 'recipes',
  gratitude: 'gratitude',
  appointments: 'appointments',
  frenchPractice: 'french_practice'
} as const;

export type WorkoutCategory = 'Cardio' | 'Strength' | 'Yoga' | 'Bodyweight' | 'Other';

export type Workout = {
  id: string;
  name: string;
  category: WorkoutCategory;
  duration: number;
  notes?: string;
  date: string;
  createdAt: string;
};

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export type Meal = {
  id: string;
  name: string;
  type: MealType;
  calories: number;
  notes?: string;
  date: string;
  createdAt: string;
};

export type Recipe = {
  id: string;
  title: string;
  ingredients: string;
  instructions: string;
  category: string;
  createdAt: string;
};

export type GoalCategory = 'Fitness' | 'Nutrition' | 'Wellness' | 'Personal' | 'Other';
export type GoalStatus = 'In Progress' | 'Completed';

export type Goal = {
  id: string;
  title: string;
  category: GoalCategory;
  description?: string;
  targetDate?: string;
  status: GoalStatus;
  createdAt: string;
  completedAt?: string;
};

export type TaskItem = {
  id: string;
  title: string;
  notes?: string;
  dueDate?: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  order: number;
};

export type TaskList = {
  id: string;
  name: string;
  createdAt: string;
  tasks: TaskItem[];
};

export type SleepQuality = 'Great' | 'Good' | 'Okay' | 'Poor';

export type SleepLog = {
  id: string;
  date: string;
  hours: number;
  quality: SleepQuality;
  notes?: string;
  createdAt: string;
};

export type GratitudeEntry = {
  id: string;
  date: string;
  note: string;
  createdAt: string;
};

export type FrenchPracticeEntry = {
  id: string;
  date: string;
  word: string;
  verb: string;
  answer: string;
  createdAt: string;
};

export type AppointmentType = 'Doctor' | 'Dentist' | 'Gym' | 'Wellness' | 'Personal' | 'Other';

export type Appointment = {
  id: string;
  title: string;
  type: AppointmentType;
  date: string;
  time: string;
  location?: string;
  notes?: string;
  createdAt: string;
};

export function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getCollection<T>(key: string): T[] {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export function setCollection<T>(key: string, items: T[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(items));
}

export function addToCollection<T extends { id: string }>(key: string, item: T) {
  const items = getCollection<T>(key);
  const nextItems = [item, ...items];
  setCollection(key, nextItems);
  return nextItems;
}

export function updateInCollection<T extends { id: string }>(
  key: string,
  id: string,
  updater: (item: T) => T
) {
  const nextItems = getCollection<T>(key).map((item) => (item.id === id ? updater(item) : item));
  setCollection(key, nextItems);
  return nextItems;
}

export function deleteFromCollection<T extends { id: string }>(key: string, id: string) {
  const nextItems = getCollection<T>(key).filter((item) => item.id !== id);
  setCollection(key, nextItems);
  return nextItems;
}

export function getNumberSetting(key: string, fallback: number) {
  if (!canUseStorage()) {
    return fallback;
  }

  const value = Number(window.localStorage.getItem(key));
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export function setNumberSetting(key: string, value: number) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(key, String(value));
}

export function getTaskLists() {
  const lists = getCollection<TaskList>(STORAGE_KEYS.tasks).filter((list) => Array.isArray(list.tasks));
  if (lists.length > 0) {
    return lists.map((list) => ({
      ...list,
      tasks: [...list.tasks].sort((a, b) => a.order - b.order)
    }));
  }

  return [
    {
      id: createId(),
      name: 'Daily Habits',
      createdAt: new Date().toISOString(),
      tasks: []
    }
  ];
}

export function setTaskLists(lists: TaskList[]) {
  setCollection(STORAGE_KEYS.tasks, lists);
}

export function todayInputValue(date = new Date()) {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60_000);
  return localDate.toISOString().slice(0, 10);
}

export function getLastNDays(count: number, end = new Date()) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(end);
    date.setDate(end.getDate() - (count - index - 1));
    return todayInputValue(date);
  });
}

export function formatDisplayDate(value?: string) {
  if (!value) {
    return 'No date set';
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

export function formatShortDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    day: 'numeric'
  }).format(date);
}

export function isSameDate(value: string, compare = todayInputValue()) {
  return value === compare;
}

export function startOfWeek(date = new Date()) {
  const start = new Date(date);
  const day = start.getDay();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - day);
  return start;
}

export function isDateThisWeek(value: string, now = new Date()) {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const start = startOfWeek(now);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  return date >= start && date < end;
}

export function sortNewestByDate<T extends { date?: string; createdAt?: string }>(items: T[]) {
  return [...items].sort((a, b) => {
    const left = new Date(`${a.date ?? a.createdAt ?? ''}T00:00:00`).getTime();
    const right = new Date(`${b.date ?? b.createdAt ?? ''}T00:00:00`).getTime();
    return right - left;
  });
}

export function sortOldestByDateTime<T extends { date: string; time?: string }>(items: T[]) {
  return [...items].sort((a, b) => {
    const left = new Date(`${a.date}T${a.time || '00:00'}`).getTime();
    const right = new Date(`${b.date}T${b.time || '00:00'}`).getTime();
    return left - right;
  });
}
