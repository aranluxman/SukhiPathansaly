'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  BookIcon,
  CalendarCheckIcon,
  DumbbellIcon,
  HomeIcon,
  HeartIcon,
  ListIcon,
  MenuIcon,
  MoonIcon,
  TargetIcon,
  UtensilsIcon,
  XIcon
} from './Icons';

const navItems = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/workouts', label: 'Workouts', icon: DumbbellIcon },
  { href: '/meals', label: 'Meals', icon: UtensilsIcon },
  { href: '/recipes', label: 'Recipes', icon: BookIcon },
  { href: '/goals', label: 'Goals', icon: TargetIcon },
  { href: '/tasks', label: 'Tasks', icon: ListIcon },
  { href: '/sleep', label: 'Sleep', icon: MoonIcon },
  { href: '/gratitude', label: 'Gratitude', icon: HeartIcon },
  { href: '/appointments', label: 'Appointments', icon: CalendarCheckIcon }
];

function NavLink({
  href,
  label,
  icon: Icon,
  onClick
}: {
  href: string;
  label: string;
  icon: typeof HomeIcon;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      className={`gold-underline inline-flex items-center gap-2 px-2 py-2 text-sm font-semibold ${
        isActive ? 'text-luxury-gold-light' : 'text-luxury-muted hover:text-luxury-gold-light'
      }`}
      data-active={isActive}
      href={href}
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-luxury-line bg-luxury-black/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link className="group flex items-center gap-3" href="/">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-luxury-line bg-luxury-card text-luxury-gold shadow-gold group-hover:scale-105 group-hover:border-luxury-gold">
            <HomeIcon className="h-5 w-5" />
          </span>
          <span className="font-serif text-xl font-bold text-luxury-gold-light">Sukhi&apos;s Wellness</span>
        </Link>

        <div className="hidden items-center gap-3 xl:flex">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </div>

        <button
          aria-expanded={open}
          aria-label="Toggle navigation menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-luxury-line bg-luxury-card text-luxury-gold-light hover:scale-[1.03] hover:border-luxury-gold hover:shadow-gold xl:hidden"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          {open ? <XIcon /> : <MenuIcon />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-luxury-line bg-luxury-black px-4 pb-4 xl:hidden">
          <div className="mx-auto grid max-w-6xl gap-3 pt-3">
            {navItems.map((item) => (
              <NavLink key={item.href} {...item} onClick={() => setOpen(false)} />
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
