'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { CalendarCheckIcon, CalendarIcon, ExternalLinkIcon, PlusIcon, TrashIcon } from '@/components/Icons';
import {
  Appointment,
  AppointmentType,
  STORAGE_KEYS,
  addToCollection,
  createId,
  deleteFromCollection,
  formatDisplayDate,
  getCollection,
  setCollection,
  sortOldestByDateTime,
  todayInputValue
} from '@/lib/storage';

const appointmentTypes: AppointmentType[] = ['Doctor', 'Dentist', 'Gym', 'Wellness', 'Personal', 'Other'];
const seededAppointmentVersion = 'family-calendar-may-june-2026-v2';

const seededAppointments: Appointment[] = [
  // ── April 2026 ──
  { id: 'seed-2026-04-27-rayhan-eye', title: 'Rayhan Eye Appointment', type: 'Doctor', date: '2026-04-27', time: '15:20', notes: 'From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-04-27-track', title: 'Track and Field', type: 'Gym', date: '2026-04-27', time: '18:00', notes: 'From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-04-28-devoir', title: 'Devoir: Cours du', type: 'Personal', date: '2026-04-28', time: '17:59', notes: 'French homework due. From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-04-29-kartthik-bday', title: "Kartthik Kumarasamy's Birthday", type: 'Personal', date: '2026-04-29', time: '09:00', notes: 'From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-04-29-rcacs-flight', title: '883 RCACS – Flight', type: 'Personal', date: '2026-04-29', time: '19:00', notes: 'Cadet flight. From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-04-30-devoir', title: 'Devoir: Cours du 23 Avril', type: 'Personal', date: '2026-04-30', time: '09:00', notes: 'French homework. From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  // ── May 2026 ──
  { id: 'seed-2026-05-01-kome-lunch', title: 'Kome Lunch', type: 'Personal', date: '2026-05-01', time: '08:00', notes: 'From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-05-01-ypam-graduation', title: 'YPAM Graduation', type: 'Personal', date: '2026-05-01', time: '09:00', notes: 'Imported from the May 2026 family wall calendar.', createdAt: '2026-05-08T00:00:00.000Z' },
  { id: 'seed-2026-05-02-rayhan-ymca', title: 'Rayhan YMCA Basketball', type: 'Gym', date: '2026-05-02', time: '11:00', notes: 'From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-05-02-aran-ymca', title: 'Aran YMCA Basketball', type: 'Gym', date: '2026-05-02', time: '13:00', notes: 'From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-05-02-ninos-party', title: "Nino's Party", type: 'Personal', date: '2026-05-02', time: '14:00', notes: 'Wall calendar says 2–5.', createdAt: '2026-05-08T00:00:00.000Z' },
  { id: 'seed-2026-05-03-rayhan-ypam', title: 'Rayhan YPAM', type: 'Personal', date: '2026-05-03', time: '15:00', notes: 'From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-05-03-cadet-basketball', title: 'Cadet Basketball', type: 'Personal', date: '2026-05-03', time: '19:45', notes: 'Imported from the May 2026 family wall calendar.', createdAt: '2026-05-08T00:00:00.000Z' },
  { id: 'seed-2026-05-04-track', title: 'Track and Field', type: 'Gym', date: '2026-05-04', time: '18:00', notes: 'From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-05-05-devoir', title: 'Devoir: Cours du 28 Avril', type: 'Personal', date: '2026-05-05', time: '09:00', notes: 'French homework. From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-05-06-nishaani-bday', title: "Nishaani's Birthday", type: 'Personal', date: '2026-05-06', time: '09:00', notes: 'From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-05-06-aran-track-meet', title: 'Aran Track Meet', type: 'Gym', date: '2026-05-06', time: '09:00', notes: 'Time was not listed on the wall calendar.', createdAt: '2026-05-08T00:00:00.000Z' },
  { id: 'seed-2026-05-07-devoir', title: 'Devoir: Cours du', type: 'Personal', date: '2026-05-07', time: '17:59', notes: 'French homework due. From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-05-08-durya-dr', title: 'Durya Ali – Doctor Appointment', type: 'Doctor', date: '2026-05-08', time: '10:10', notes: 'From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-05-08-track', title: 'Track and Field', type: 'Gym', date: '2026-05-08', time: '18:00', notes: 'From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-05-10-mothers-day', title: "Mother's Day", type: 'Personal', date: '2026-05-10', time: '09:00', notes: 'From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-05-11-track', title: 'Track and Field', type: 'Gym', date: '2026-05-11', time: '18:00', notes: 'From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-05-12-aran-bday', title: "Aran Luxman's Birthday", type: 'Personal', date: '2026-05-12', time: '09:00', notes: 'From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-05-13-cadets', title: 'Cadets', type: 'Personal', date: '2026-05-13', time: '18:30', notes: 'From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-05-14-devoir', title: 'Devoir: Cours du', type: 'Personal', date: '2026-05-14', time: '17:59', notes: 'French homework due. From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-05-14-aran-track-meet', title: 'Aran Track Meet', type: 'Gym', date: '2026-05-14', time: '09:00', notes: 'Time was not listed on the wall calendar.', createdAt: '2026-05-08T00:00:00.000Z' },
  { id: 'seed-2026-05-15-track', title: 'Track and Field', type: 'Gym', date: '2026-05-15', time: '18:00', notes: 'From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-05-16-kaia', title: 'Kaia Simparica', type: 'Wellness', date: '2026-05-16', time: '08:00', notes: 'From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-05-17-sahana-gliding', title: 'Sahana Gliding', type: 'Personal', date: '2026-05-17', time: '07:00', notes: 'From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-05-17-aarya-birthday-party', title: 'Aarya Birthday Party', type: 'Personal', date: '2026-05-17', time: '09:00', notes: 'Wall calendar note. Time was not listed.', createdAt: '2026-05-08T00:00:00.000Z' },
  { id: 'seed-2026-05-18-victoria-day', title: 'Victoria Day', type: 'Personal', date: '2026-05-18', time: '09:00', notes: 'Regional holiday. From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-05-18-track', title: 'Track and Field', type: 'Gym', date: '2026-05-18', time: '18:00', notes: 'From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-05-20-cadets', title: 'Cadets', type: 'Personal', date: '2026-05-20', time: '18:30', notes: 'From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-05-21-aarya-bday', title: 'Aarya Birthday', type: 'Personal', date: '2026-05-21', time: '09:00', notes: 'From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-05-21-toronto-zoo', title: 'Toronto Zoo Trip', type: 'Personal', date: '2026-05-21', time: '08:00', notes: 'From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-05-21-aran-track-meet', title: 'Aran Track Meet', type: 'Gym', date: '2026-05-21', time: '09:00', notes: 'Multi-day meet marked from May 21 to May 22.', createdAt: '2026-05-08T00:00:00.000Z' },
  { id: 'seed-2026-05-22-aran-track-meet', title: 'Aran Track Meet', type: 'Gym', date: '2026-05-22', time: '09:00', notes: 'Multi-day meet marked from May 21 to May 22.', createdAt: '2026-05-08T00:00:00.000Z' },
  { id: 'seed-2026-05-22-track', title: 'Track and Field', type: 'Gym', date: '2026-05-22', time: '18:00', notes: 'From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-05-24-run-for-woman', title: 'Run for Woman', type: 'Gym', date: '2026-05-24', time: '08:00', notes: 'From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-05-24-rayhan-ypam', title: 'Rayhan YPAM', type: 'Personal', date: '2026-05-24', time: '15:00', notes: 'From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-05-24-collingwood-trip', title: 'Collingwood', type: 'Personal', date: '2026-05-24', time: '09:00', notes: 'Trip marked from May 24 to May 26.', createdAt: '2026-05-08T00:00:00.000Z' },
  { id: 'seed-2026-05-25-collingwood-trip', title: 'Collingwood', type: 'Personal', date: '2026-05-25', time: '09:00', notes: 'Trip marked from May 24 to May 26.', createdAt: '2026-05-08T00:00:00.000Z' },
  { id: 'seed-2026-05-25-track', title: 'Track and Field', type: 'Gym', date: '2026-05-25', time: '18:00', notes: 'From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-05-26-collingwood-trip', title: 'Collingwood', type: 'Personal', date: '2026-05-26', time: '09:00', notes: 'Trip marked from May 24 to May 26.', createdAt: '2026-05-08T00:00:00.000Z' },
  { id: 'seed-2026-05-27-spring-concert', title: 'Spring Concert', type: 'Personal', date: '2026-05-27', time: '18:00', notes: 'From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-05-27-cadets', title: 'Cadets', type: 'Personal', date: '2026-05-27', time: '18:30', notes: 'From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-05-27-aran-track-meet', title: 'Aran Track Meet', type: 'Gym', date: '2026-05-27', time: '09:00', notes: 'Multi-day meet marked from May 27 to May 28.', createdAt: '2026-05-08T00:00:00.000Z' },
  { id: 'seed-2026-05-28-aran-track-meet', title: 'Aran Track Meet', type: 'Gym', date: '2026-05-28', time: '09:00', notes: 'Multi-day meet marked from May 27 to May 28.', createdAt: '2026-05-08T00:00:00.000Z' },
  { id: 'seed-2026-05-29-rayhan-eye', title: 'Rayhan Eye Appointment', type: 'Doctor', date: '2026-05-29', time: '14:50', notes: 'From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-05-29-track', title: 'Track and Field', type: 'Gym', date: '2026-05-29', time: '18:00', notes: 'From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-05-31-ypam-finals', title: 'YPAM Level 2 Finals', type: 'Personal', date: '2026-05-31', time: '12:30', notes: 'From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-05-31-swimming', title: 'Swimming', type: 'Gym', date: '2026-05-31', time: '12:50', notes: 'From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  // ── June 2026 ──
  { id: 'seed-2026-06-01-track', title: 'Track and Field', type: 'Gym', date: '2026-06-01', time: '18:00', notes: 'From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-06-03-cadets', title: 'Cadets', type: 'Personal', date: '2026-06-03', time: '18:30', notes: 'From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-06-05-track', title: 'Track and Field', type: 'Gym', date: '2026-06-05', time: '18:00', notes: 'From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-06-06-vinoathh-bday', title: "Vinoathh Pathansaly's Birthday", type: 'Personal', date: '2026-06-06', time: '09:00', notes: 'From Google Calendar.', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 'seed-2026-06-18-aran-track-meet', title: 'Aran Track Meet', type: 'Gym', date: '2026-06-18', time: '09:00', notes: 'Imported from the June 2026 family wall calendar.', createdAt: '2026-05-08T00:00:00.000Z' },
  { id: 'seed-2026-06-25-mexico-trip', title: 'Mexico', type: 'Personal', date: '2026-06-25', time: '09:00', notes: 'Trip marked from June 25 to June 27.', createdAt: '2026-05-08T00:00:00.000Z' },
  { id: 'seed-2026-06-26-mexico-trip', title: 'Mexico', type: 'Personal', date: '2026-06-26', time: '09:00', notes: 'Trip marked from June 25 to June 27.', createdAt: '2026-05-08T00:00:00.000Z' },
  { id: 'seed-2026-06-27-mexico-trip', title: 'Mexico', type: 'Personal', date: '2026-06-27', time: '09:00', notes: 'Trip marked from June 25 to June 27.', createdAt: '2026-05-08T00:00:00.000Z' }
];

const initialForm = {
  title: '',
  type: 'Doctor' as AppointmentType,
  date: todayInputValue(),
  time: '',
  location: '',
  notes: ''
};

function googleCalendarUrl(appointment: Appointment): string {
  const dateStr = appointment.date.replace(/-/g, '');
  const [hh, mm] = (appointment.time || '09:00').split(':');
  const endHh = String((Number(hh) + 1) % 24).padStart(2, '0');
  const start = `${dateStr}T${hh}${mm}00`;
  const end = `${dateStr}T${endHh}${mm}00`;
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: appointment.title,
    dates: `${start}/${end}`,
    details: appointment.notes || '',
    location: appointment.location || ''
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function monthLabel(date: Date) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
}

function toInputDate(date: Date) {
  return todayInputValue(date);
}

function makeCalendarDays(month: Date) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1);
  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return {
      date,
      value: toInputDate(date),
      day: date.getDate(),
      inMonth: date.getMonth() === monthIndex
    };
  });
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [form, setForm] = useState(initialForm);
  const [selectedDate, setSelectedDate] = useState(todayInputValue());
  const [visibleMonth, setVisibleMonth] = useState(() => new Date());

  useEffect(() => {
    const savedAppointments = getCollection<Appointment>(STORAGE_KEYS.appointments);
    const hasSeeded = window.localStorage.getItem(STORAGE_KEYS.appointmentSeedVersion) === seededAppointmentVersion;
    const appointmentsToShow = hasSeeded
      ? savedAppointments
      : [
          ...savedAppointments,
          ...seededAppointments.filter(
            (seeded) =>
              !savedAppointments.some(
                (appointment) =>
                  appointment.id === seeded.id ||
                  (appointment.title === seeded.title && appointment.date === seeded.date)
              )
          )
        ];

    if (!hasSeeded) {
      setCollection(STORAGE_KEYS.appointments, appointmentsToShow);
      window.localStorage.setItem(STORAGE_KEYS.appointmentSeedVersion, seededAppointmentVersion);
    }

    setAppointments(sortOldestByDateTime(appointmentsToShow));
    setForm((current) => ({ ...current, date: todayInputValue() }));
  }, []);

  const calendarDays = useMemo(() => makeCalendarDays(visibleMonth), [visibleMonth]);
  const selectedEvents = useMemo(
    () => sortOldestByDateTime(appointments.filter((appointment) => appointment.date === selectedDate)),
    [appointments, selectedDate]
  );
  const upcomingEvents = useMemo(() => {
    const today = todayInputValue();
    return sortOldestByDateTime(appointments.filter((appointment) => appointment.date >= today)).slice(0, 8);
  }, [appointments]);

  function submitAppointment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.title.trim() || !form.date || !form.time) return;

    const appointment: Appointment = {
      id: createId(),
      title: form.title.trim(),
      type: form.type,
      date: form.date,
      time: form.time,
      location: form.location.trim(),
      notes: form.notes.trim(),
      createdAt: new Date().toISOString()
    };

    const nextAppointments = sortOldestByDateTime(addToCollection<Appointment>(STORAGE_KEYS.appointments, appointment));
    setAppointments(nextAppointments);
    setSelectedDate(appointment.date);
    setVisibleMonth(new Date(`${appointment.date}T00:00:00`));
    setForm({ ...initialForm, date: appointment.date });
  }

  function deleteAppointment(id: string) {
    setAppointments(sortOldestByDateTime(deleteFromCollection<Appointment>(STORAGE_KEYS.appointments, id)));
  }

  function shiftMonth(offset: number) {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  }

  function selectDay(value: string) {
    setSelectedDate(value);
    setForm((current) => ({ ...current, date: value }));
  }

  return (
    <div className="page-shell">
      <section className="mb-8">
        <p className="soft-label text-luxury-gold-light">Appointments</p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-luxury-text">A clear calendar for what&apos;s next</h1>
        <p className="mt-3 max-w-2xl text-luxury-muted">
          All appointments in one polished local calendar — with one-tap links to add any event to Google Calendar.
        </p>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="section-card">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="soft-label">Calendar</p>
              <h2 className="mt-1 font-serif text-2xl font-bold text-luxury-text">{monthLabel(visibleMonth)}</h2>
            </div>
            <div className="flex gap-2">
              <button className="secondary-button px-3" onClick={() => shiftMonth(-1)} type="button">Prev</button>
              <button
                className="secondary-button px-3"
                onClick={() => {
                  const today = todayInputValue();
                  setSelectedDate(today);
                  setVisibleMonth(new Date());
                  setForm((current) => ({ ...current, date: today }));
                }}
                type="button"
              >
                Today
              </button>
              <button className="secondary-button px-3" onClick={() => shiftMonth(1)} type="button">Next</button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase tracking-[0.14em] text-luxury-muted">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-7 gap-2">
            {calendarDays.map((day) => {
              const eventCount = appointments.filter((appointment) => appointment.date === day.value).length;
              const selected = selectedDate === day.value;
              const today = todayInputValue() === day.value;

              return (
                <button
                  className={`min-h-20 rounded-lg border p-2 text-left transition-colors ${
                    selected
                      ? 'border-luxury-gold bg-luxury-gold/15 shadow-gold'
                      : 'border-luxury-line bg-black/20 hover:border-luxury-gold hover:bg-luxury-card'
                  } ${day.inMonth ? 'text-luxury-text' : 'text-luxury-muted/45'}`}
                  key={day.value}
                  onClick={() => selectDay(day.value)}
                  type="button"
                >
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${
                      today ? 'bg-luxury-gold text-white' : ''
                    }`}
                  >
                    {day.day}
                  </span>
                  {eventCount > 0 ? (
                    <span className="mt-2 block rounded-full bg-luxury-gold/20 px-2 py-0.5 text-xs font-bold text-luxury-gold-light">
                      {eventCount}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <section className="mt-6 border-t border-luxury-line pt-5">
            <h3 className="font-serif text-xl font-bold text-luxury-text">{formatDisplayDate(selectedDate)}</h3>
            <div className="mt-4 grid gap-3">
              {selectedEvents.length === 0 ? (
                <p className="rounded-lg border border-dashed border-luxury-line p-4 text-sm text-luxury-muted">
                  No appointments on this day.
                </p>
              ) : (
                selectedEvents.map((appointment) => (
                  <article className="rounded-xl border border-luxury-line bg-black/25 p-4" key={appointment.id}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <span className="gold-badge">{appointment.type}</span>
                        <h4 className="mt-3 font-serif text-xl font-bold text-luxury-text">{appointment.title}</h4>
                        <p className="mt-1 text-sm font-semibold text-luxury-muted">
                          {appointment.time}
                          {appointment.location ? ` · ${appointment.location}` : ''}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <a
                          aria-label={`Add ${appointment.title} to Google Calendar`}
                          className="danger-button border-luxury-line bg-luxury-gold/10 text-luxury-gold-light hover:border-luxury-gold hover:bg-luxury-gold/20"
                          href={googleCalendarUrl(appointment)}
                          rel="noopener noreferrer"
                          target="_blank"
                          title="Add to Google Calendar"
                        >
                          <ExternalLinkIcon className="h-4 w-4" />
                        </a>
                        <button
                          aria-label={`Delete ${appointment.title}`}
                          className="danger-button shrink-0"
                          onClick={() => deleteAppointment(appointment.id)}
                          type="button"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {appointment.notes ? (
                      <p className="mt-3 text-sm leading-6 text-luxury-muted">{appointment.notes}</p>
                    ) : null}
                  </article>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="grid content-start gap-6">
          <form className="section-card" onSubmit={submitAppointment}>
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-luxury-line bg-luxury-gold/10 text-luxury-gold-light">
                <CalendarCheckIcon />
              </span>
              <div>
                <h2 className="font-serif text-xl font-bold text-luxury-text">Add appointment</h2>
                <p className="text-sm text-luxury-muted">Doctor, dentist, personal, or anything important.</p>
              </div>
            </div>

            <div className="grid gap-4">
              <label className="grid gap-2">
                <span className="soft-label">Title</span>
                <input
                  className="form-field"
                  onChange={(event) => setForm((value) => ({ ...value, title: event.target.value }))}
                  placeholder="Dental cleaning"
                  required
                  value={form.title}
                />
              </label>

              <label className="grid gap-2">
                <span className="soft-label">Type</span>
                <select
                  className="form-field"
                  onChange={(event) => setForm((value) => ({ ...value, type: event.target.value as AppointmentType }))}
                  value={form.type}
                >
                  {appointmentTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
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
                  <span className="soft-label">Time</span>
                  <input
                    className="form-field"
                    onChange={(event) => setForm((value) => ({ ...value, time: event.target.value }))}
                    required
                    type="time"
                    value={form.time}
                  />
                </label>
              </div>

              <label className="grid gap-2">
                <span className="soft-label">Location</span>
                <input
                  className="form-field"
                  onChange={(event) => setForm((value) => ({ ...value, location: event.target.value }))}
                  placeholder="Clinic, gym, office"
                  value={form.location}
                />
              </label>

              <label className="grid gap-2">
                <span className="soft-label">Notes</span>
                <textarea
                  className="form-field min-h-24 resize-y"
                  onChange={(event) => setForm((value) => ({ ...value, notes: event.target.value }))}
                  placeholder="Bring insurance card, arrive 10 minutes early."
                  value={form.notes}
                />
              </label>

              <button className="primary-button w-full" type="submit">
                <PlusIcon className="h-5 w-5" />
                Add Appointment
              </button>
            </div>
          </form>

          <section className="section-card">
            <div className="mb-4 flex items-center gap-3">
              <CalendarIcon className="h-5 w-5 text-luxury-gold-light" />
              <h2 className="font-serif text-xl font-bold text-luxury-text">Upcoming</h2>
            </div>
            <div className="grid gap-3">
              {upcomingEvents.length === 0 ? (
                <p className="text-sm text-luxury-muted">No upcoming appointments yet.</p>
              ) : (
                upcomingEvents.map((appointment) => (
                  <article className="rounded-xl border border-luxury-line bg-black/25 p-4" key={appointment.id}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <span className="gold-badge">{appointment.type}</span>
                        <h3 className="mt-2 font-serif text-lg font-bold text-luxury-text">{appointment.title}</h3>
                        <p className="mt-1 text-sm font-semibold text-luxury-muted">
                          {formatDisplayDate(appointment.date)} · {appointment.time}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <a
                          aria-label={`Add ${appointment.title} to Google Calendar`}
                          className="danger-button border-luxury-line bg-luxury-gold/10 text-luxury-gold-light hover:border-luxury-gold hover:bg-luxury-gold/20"
                          href={googleCalendarUrl(appointment)}
                          rel="noopener noreferrer"
                          target="_blank"
                          title="Add to Google Calendar"
                        >
                          <ExternalLinkIcon className="h-4 w-4" />
                        </a>
                        <button
                          aria-label={`Delete ${appointment.title}`}
                          className="danger-button shrink-0"
                          onClick={() => deleteAppointment(appointment.id)}
                          type="button"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
