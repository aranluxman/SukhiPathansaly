'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  BookIcon,
  CalendarCheckIcon,
  HeartIcon,
  HomeIcon,
  ListIcon,
  MenuIcon,
  MoonIcon,
  SunIcon,
  TargetIcon,
  XIcon
} from './Icons';
import { useTheme } from './ThemeProvider';

const navItems = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/recipes', label: 'Recipes', icon: BookIcon },
  { href: '/goals', label: 'Goals', icon: TargetIcon },
  { href: '/tasks', label: 'Tasks', icon: ListIcon },
  { href: '/sleep', label: 'Sleep', icon: MoonIcon },
  { href: '/gratitude', label: 'Gratitude', icon: HeartIcon },
  { href: '/appointments', label: 'Appointments', icon: CalendarCheckIcon },
  { href: '/french', label: 'French', icon: BookIcon }
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

function ThemeToggle({ onClick }: { onClick?: () => void }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  function handleClick() {
    toggle();
    onClick?.();
  }

  return (
    <button
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-luxury-line bg-luxury-card text-luxury-gold-light hover:scale-[1.03] hover:border-luxury-gold hover:shadow-gold"
      onClick={handleClick}
      title={isDark ? 'Light mode' : 'Dark mode'}
      type="button"
    >
      {isDark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
    </button>
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
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <ThemeToggle />
          <button
            aria-expanded={open}
            aria-label="Toggle navigation menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-luxury-line bg-luxury-card text-luxury-gold-light hover:scale-[1.03] hover:border-luxury-gold hover:shadow-gold"
            onClick={() => setOpen((value) => !value)}
            type="button"
          >
            {open ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
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
