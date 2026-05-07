'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CalendarIcon, ChevronDownIcon, GripIcon, ListIcon, PlusIcon, TrashIcon } from '@/components/Icons';
import { TaskItem, TaskList, createId, formatDisplayDate, getTaskLists, setTaskLists, todayInputValue } from '@/lib/storage';

const initialTaskForm = {
  title: '',
  notes: '',
  dueDate: ''
};

function SortableTaskRow({
  task,
  onDelete,
  onToggle
}: {
  task: TaskItem;
  onDelete: (taskId: string) => void;
  onToggle: (taskId: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <article
      className={`group flex items-start gap-3 rounded-lg border border-luxury-line bg-black/25 p-4 ${
        isDragging ? 'border-luxury-gold shadow-gold' : 'hover:border-luxury-gold hover:shadow-gold'
      }`}
      ref={setNodeRef}
      style={style}
    >
      <button
        aria-label={`Mark ${task.title} complete`}
        className="mt-0.5 h-6 w-6 shrink-0 rounded-full border-2 border-luxury-gold bg-transparent hover:scale-110 hover:bg-luxury-gold/20"
        onClick={() => onToggle(task.id)}
        type="button"
      />
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-luxury-text">{task.title}</h3>
        {task.notes ? <p className="mt-1 text-sm leading-6 text-luxury-muted">{task.notes}</p> : null}
        {task.dueDate ? (
          <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-luxury-line px-3 py-1 text-xs font-bold text-luxury-gold-light">
            <CalendarIcon className="h-3.5 w-3.5" />
            {formatDisplayDate(task.dueDate)}
          </p>
        ) : null}
      </div>
      <button
        aria-label={`Drag ${task.title}`}
        className="mt-0.5 cursor-grab rounded-md p-1 text-luxury-muted hover:text-luxury-gold-light active:cursor-grabbing"
        type="button"
        {...attributes}
        {...listeners}
      >
        <GripIcon className="h-5 w-5" />
      </button>
      <button
        aria-label={`Delete ${task.title}`}
        className="mt-0.5 rounded-md p-1 text-red-300 opacity-0 hover:bg-red-500/10 hover:text-red-200 group-hover:opacity-100"
        onClick={() => onDelete(task.id)}
        type="button"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    </article>
  );
}

export default function TasksPage() {
  const [lists, setLists] = useState<TaskList[]>([]);
  const [activeListId, setActiveListId] = useState('');
  const [newListName, setNewListName] = useState('');
  const [taskForm, setTaskForm] = useState(initialTaskForm);
  const [completedOpen, setCompletedOpen] = useState(true);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  useEffect(() => {
    const savedLists = getTaskLists();
    setLists(savedLists);
    setActiveListId(savedLists[0]?.id ?? '');
  }, []);

  const activeList = lists.find((list) => list.id === activeListId) ?? lists[0];
  const activeTasks = useMemo(
    () => [...(activeList?.tasks ?? [])].filter((task) => !task.completed).sort((a, b) => a.order - b.order),
    [activeList]
  );
  const completedTasks = useMemo(
    () =>
      [...(activeList?.tasks ?? [])]
        .filter((task) => task.completed)
        .sort((a, b) => new Date(b.completedAt ?? b.createdAt).getTime() - new Date(a.completedAt ?? a.createdAt).getTime()),
    [activeList]
  );

  function persist(nextLists: TaskList[]) {
    setLists(nextLists);
    setTaskLists(nextLists);
  }

  function updateActiveList(updater: (list: TaskList) => TaskList) {
    if (!activeList) {
      return;
    }

    persist(lists.map((list) => (list.id === activeList.id ? updater(list) : list)));
  }

  function addList(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!newListName.trim()) {
      return;
    }

    const list: TaskList = {
      id: createId(),
      name: newListName.trim(),
      createdAt: new Date().toISOString(),
      tasks: []
    };
    const nextLists = [...lists, list];
    persist(nextLists);
    setActiveListId(list.id);
    setNewListName('');
  }

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!taskForm.title.trim()) {
      return;
    }

    const nextOrder = activeTasks.length ? Math.max(...activeTasks.map((task) => task.order)) + 1 : 0;
    const task: TaskItem = {
      id: createId(),
      title: taskForm.title.trim(),
      notes: taskForm.notes.trim(),
      dueDate: taskForm.dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
      order: nextOrder
    };

    updateActiveList((list) => ({ ...list, tasks: [...list.tasks, task] }));
    setTaskForm(initialTaskForm);
  }

  function toggleTask(taskId: string) {
    updateActiveList((list) => ({
      ...list,
      tasks: list.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              completedAt: task.completed ? undefined : new Date().toISOString()
            }
          : task
      )
    }));
  }

  function deleteTask(taskId: string) {
    updateActiveList((list) => ({ ...list, tasks: list.tasks.filter((task) => task.id !== taskId) }));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = activeTasks.findIndex((task) => task.id === active.id);
    const newIndex = activeTasks.findIndex((task) => task.id === over.id);

    if (oldIndex < 0 || newIndex < 0) {
      return;
    }

    const reordered = arrayMove(activeTasks, oldIndex, newIndex).map((task, index) => ({ ...task, order: index }));
    updateActiveList((list) => ({
      ...list,
      tasks: [...reordered, ...list.tasks.filter((task) => task.completed)]
    }));
  }

  return (
    <div className="page-shell">
      <section className="mb-8">
        <p className="soft-label text-luxury-gold-light">Tasks</p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-luxury-text">Today&apos;s quiet little wins</h1>
        <p className="mt-3 max-w-2xl text-luxury-muted">
          A clean Google-Tasks-inspired list for shopping, health routines, daily habits, and anything else she wants to keep moving.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="section-card h-fit">
          <div className="mb-4 flex items-center gap-3">
            <ListIcon className="h-5 w-5 text-luxury-gold-light" />
            <h2 className="font-serif text-xl font-bold text-luxury-text">Lists</h2>
          </div>
          <div className="grid gap-2">
            {lists.map((list) => {
              const pending = list.tasks.filter((task) => !task.completed).length;

              return (
                <button
                  className={`flex items-center justify-between rounded-lg border px-3 py-3 text-left text-sm font-bold ${
                    list.id === activeListId
                      ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-gold-light shadow-gold'
                      : 'border-transparent text-luxury-muted hover:border-luxury-line hover:text-luxury-text'
                  }`}
                  key={list.id}
                  onClick={() => setActiveListId(list.id)}
                  type="button"
                >
                  <span>{list.name}</span>
                  <span>{pending}</span>
                </button>
              );
            })}
          </div>

          <form className="mt-5 grid gap-3 border-t border-luxury-line pt-5" onSubmit={addList}>
            <input
              className="form-field"
              onChange={(event) => setNewListName(event.target.value)}
              placeholder="New list"
              value={newListName}
            />
            <button className="secondary-button justify-start" type="submit">
              <PlusIcon className="h-4 w-4 text-luxury-gold-light" />
              Add list
            </button>
          </form>
        </aside>

        <main className="section-card">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="soft-label">Active list</p>
              <h2 className="mt-1 font-serif text-3xl font-bold text-luxury-text">{activeList?.name ?? 'Tasks'}</h2>
            </div>
            <span className="gold-badge">{activeTasks.length} pending</span>
          </div>

          <form className="grid gap-3 rounded-lg border border-luxury-line bg-black/25 p-4" onSubmit={addTask}>
            <div className="grid gap-3 sm:grid-cols-[1fr_170px]">
              <input
                className="form-field"
                onChange={(event) => setTaskForm((value) => ({ ...value, title: event.target.value }))}
                placeholder="Add a task"
                required
                value={taskForm.title}
              />
              <input
                className="form-field"
                min={todayInputValue()}
                onChange={(event) => setTaskForm((value) => ({ ...value, dueDate: event.target.value }))}
                type="date"
                value={taskForm.dueDate}
              />
            </div>
            <textarea
              className="form-field min-h-20 resize-y"
              onChange={(event) => setTaskForm((value) => ({ ...value, notes: event.target.value }))}
              placeholder="Notes, optional"
              value={taskForm.notes}
            />
            <button className="primary-button justify-self-start" type="submit">
              <PlusIcon className="h-5 w-5" />
              Add task
            </button>
          </form>

          <div className="mt-6">
            {activeTasks.length === 0 ? (
              <div className="rounded-lg border border-dashed border-luxury-line p-8 text-center text-luxury-muted">
                This list is clear. Add something small and satisfying.
              </div>
            ) : (
              <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
                <SortableContext items={activeTasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
                  <div className="grid gap-3">
                    {activeTasks.map((task) => (
                      <SortableTaskRow key={task.id} onDelete={deleteTask} onToggle={toggleTask} task={task} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>

          <section className="mt-8 border-t border-luxury-line pt-5">
            <button
              className="flex w-full items-center justify-between text-left"
              onClick={() => setCompletedOpen((value) => !value)}
              type="button"
            >
              <span className="font-serif text-xl font-bold text-luxury-text">Completed</span>
              <span className="inline-flex items-center gap-2 text-sm font-bold text-luxury-muted">
                {completedTasks.length}
                <ChevronDownIcon className={`h-5 w-5 ${completedOpen ? 'rotate-180' : ''}`} />
              </span>
            </button>

            {completedOpen ? (
              <div className="mt-4 grid gap-3">
                {completedTasks.length === 0 ? (
                  <p className="text-sm text-luxury-muted">Completed tasks will settle here.</p>
                ) : (
                  completedTasks.map((task) => (
                    <article
                      className="group flex items-start gap-3 rounded-lg border border-luxury-line bg-black/20 p-4 opacity-75"
                      key={task.id}
                    >
                      <button
                        aria-label={`Reopen ${task.title}`}
                        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-luxury-gold bg-luxury-gold text-black"
                        onClick={() => toggleTask(task.id)}
                        type="button"
                      >
                        ✓
                      </button>
                      <div className="min-w-0 flex-1">
                        <h3 className="completed-strike font-semibold text-luxury-muted">{task.title}</h3>
                        {task.notes ? <p className="mt-1 text-sm leading-6 text-luxury-muted">{task.notes}</p> : null}
                      </div>
                      <button
                        aria-label={`Delete ${task.title}`}
                        className="rounded-md p-1 text-red-300 opacity-0 hover:bg-red-500/10 hover:text-red-200 group-hover:opacity-100"
                        onClick={() => deleteTask(task.id)}
                        type="button"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </article>
                  ))
                )}
              </div>
            ) : null}
          </section>
        </main>
      </section>
    </div>
  );
}
