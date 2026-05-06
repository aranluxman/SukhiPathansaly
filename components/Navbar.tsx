'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  BookIcon,
  DumbbellIcon,
  HomeIcon,
  MenuIcon,
  TargetIcon,
  UtensilsIcon,
  XIcon
} from './Icons';

const navItems = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/workouts', label: 'Workouts', icon: DumbbellIcon },
  { href: '/meals', label: 'Meals', icon: UtensilsIcon },
  { href: '/recipes', label: 'Recipes', icon: BookIcon },
  { href: '/goals', label: 'Goals', icon: TargetIcon }
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
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:bg-blush-50 ${
        isActive ? 'bg-blush-100 text-blush-600 shadow-sm' : 'text-slate-600'
      }`}
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
    <header className="sticky top-0 z-40 border-b border-blush-100/70 bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link className="group flex items-center gap-3" href="/">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blush-100 text-blush-600 shadow-sm transition group-hover:scale-105">
            <HomeIcon className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold text-slate-900">Sukhi&apos;s Wellness</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </div>

        <button
          aria-expanded={open}
          aria-label="Toggle navigation menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-blush-100 text-slate-700 shadow-sm transition hover:bg-blush-50 md:hidden"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          {open ? <XIcon /> : <MenuIcon />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-blush-100 bg-white px-4 pb-4 md:hidden">
          <div className="mx-auto grid max-w-6xl gap-2 pt-3">
            {navItems.map((item) => (
              <NavLink key={item.href} {...item} onClick={() => setOpen(false)} />
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
