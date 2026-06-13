import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout } from '../features/authSlice';
import { useLogoutMutation } from '../api/authApi';
import { useTheme } from '../context/ThemeContext';

type NavItem = {
  to: string;
  label: string;
  icon: string;
  end?: boolean;
  roles?: string[];
};

const NAV: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: '◧', end: true },
  {
    to: '/orders', label: 'Orders', icon: '▤',
    roles: ['superAdmin', 'merchandiser', 'productionManager', 'accounts', 'viewer'],
  },
  {
    to: '/design', label: 'Design & Sampling', icon: '✎',
    roles: ['superAdmin', 'merchandiser'],
  },
  {
    to: '/procurement', label: 'Procurement', icon: '⛁',
    roles: ['superAdmin', 'merchandiser', 'accounts', 'productionManager'],
  },
  {
    to: '/inventory', label: 'Inventory', icon: '▥',
    roles: ['superAdmin', 'accounts', 'productionManager'],
  },
  {
    to: '/production', label: 'Production', icon: '⚙',
    roles: ['superAdmin', 'productionManager', 'qcInspector'],
  },
  {
    to: '/quality', label: 'Quality Control', icon: '✓',
    roles: ['superAdmin', 'productionManager', 'qcInspector'],
  },
  {
    to: '/costing', label: 'Costing', icon: '₹',
    roles: ['superAdmin', 'merchandiser', 'accounts'],
  },
  {
    to: '/dispatch', label: 'Dispatch', icon: '▶',
    roles: ['superAdmin', 'merchandiser', 'productionManager', 'accounts'],
  },
  {
    to: '/invoicing', label: 'Invoicing', icon: '⎙',
    roles: ['superAdmin', 'accounts'],
  },
  {
    to: '/reports', label: 'Reports', icon: '▦',
    roles: ['superAdmin', 'merchandiser', 'productionManager', 'accounts', 'viewer'],
  },
  {
    to: '/settings', label: 'Settings', icon: '⚒',
    roles: ['superAdmin'],
  },
];

// ── SVG icons ────────────────────────────────────────────────────────────────

function IconMenu() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function IconX() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function IconSun() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function AppShell() {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try { await logoutApi().unwrap(); } catch { /* ignore network errors on logout */ }
    dispatch(logout());
    navigate('/login');
  };
  const location = useLocation();
  const { theme, toggle } = useTheme();

  // Desktop: expanded vs icon-rail
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('sidebar-collapsed') === 'true'
  );

  // Mobile/tablet: drawer open vs closed
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close drawer on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close drawer when viewport grows past lg breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      localStorage.setItem('sidebar-collapsed', String(!prev));
      return !prev;
    });
  };

  const visibleNav = NAV.filter(
    (item) => !item.roles || (user?.role && item.roles.includes(user.role))
  );

  // ── Shared sidebar content ─────────────────────────────────────────────────
  // Used in both the desktop rail and mobile drawer
  const sidebarContent = (isMobile: boolean) => (
    <>
      {/* ── Logo row ── */}
      <div
        className={[
          'flex items-center border-b border-ink-700 shrink-0 h-[60px]',
          !isMobile && collapsed ? 'justify-center px-2' : 'gap-3 px-4',
        ].join(' ')}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500 font-mono text-sm font-bold text-gray-900">
          L
        </div>

        {/* Text: always visible on mobile, hidden when desktop-collapsed */}
        <div
          className={[
            'overflow-hidden transition-all duration-300',
            !isMobile && collapsed ? 'w-0 opacity-0' : 'flex-1 opacity-100',
          ].join(' ')}
        >
          <p className="font-mono text-sm font-bold tracking-wide text-slate-900 dark:text-slate-50 whitespace-nowrap">
            LOOMLINE
          </p>
          <p className="text-[10px] uppercase tracking-[0.25em] text-teal-500 dark:text-teal-400 whitespace-nowrap">
            Garment ERP
          </p>
        </div>

        {/* Mobile close button */}
        {isMobile && (
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-ink-800 hover:text-slate-900 dark:hover:text-slate-100"
            aria-label="Close menu"
          >
            <IconX />
          </button>
        )}
      </div>

      {/* ── Nav items ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-3 space-y-0.5">
        {visibleNav.map((item) => (
          <div key={item.to} className="relative group/navitem">
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  'flex items-center rounded-lg text-sm font-medium transition-colors duration-150',
                  !isMobile && collapsed
                    ? 'justify-center p-2.5 mx-auto w-10 h-10'
                    : 'gap-3 px-3 py-2.5',
                  isActive
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/30'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-ink-800 hover:text-slate-900 dark:hover:text-slate-100',
                ].join(' ')
              }
            >
              <span className="font-mono text-base shrink-0">{item.icon}</span>

              {/* Label: hidden when desktop-collapsed */}
              <span
                className={[
                  'whitespace-nowrap transition-all duration-300 overflow-hidden',
                  !isMobile && collapsed ? 'w-0 opacity-0' : 'opacity-100',
                ].join(' ')}
              >
                {item.label}
              </span>
            </NavLink>

            {/* Tooltip (desktop collapsed only) */}
            {!isMobile && collapsed && (
              <div
                className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg border border-ink-700 bg-ink-800 px-3 py-1.5 text-xs font-medium text-slate-100 shadow-lg opacity-0 transition-opacity duration-150 group-hover/navitem:opacity-100"
                role="tooltip"
              >
                {item.label}
                {/* Arrow */}
                <span className="absolute -left-[5px] top-1/2 -translate-y-1/2 h-2.5 w-2.5 rotate-45 border-b border-l border-ink-700 bg-ink-800" />
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* ── Footer ── */}
      <div className="shrink-0 border-t border-ink-700 p-2 space-y-1">
        {/* User card */}
        <div
          className={[
            'flex items-center rounded-lg bg-ink-800',
            !isMobile && collapsed ? 'justify-center p-2' : 'gap-3 px-3 py-2.5',
          ].join(' ')}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-500/20 font-mono text-sm font-bold text-teal-600 dark:text-teal-300">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div
            className={[
              'min-w-0 overflow-hidden transition-all duration-300',
              !isMobile && collapsed ? 'w-0 opacity-0' : 'flex-1 opacity-100',
            ].join(' ')}
          >
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
              {user?.name}
            </p>
            <p className="truncate font-mono text-[10px] uppercase tracking-wider text-slate-500 whitespace-nowrap">
              {user?.role}
            </p>
          </div>
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className={[
            'flex w-full items-center rounded-lg px-3 py-2 text-sm text-slate-500 transition hover:bg-ink-800 hover:text-amber-600 dark:hover:text-amber-400',
            !isMobile && collapsed ? 'justify-center' : 'gap-2',
          ].join(' ')}
        >
          {theme === 'dark' ? <IconSun /> : <IconMoon />}
          <span
            className={[
              'overflow-hidden transition-all duration-300 whitespace-nowrap',
              !isMobile && collapsed ? 'w-0 opacity-0' : 'opacity-100',
            ].join(' ')}
          >
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </span>
        </button>

        {/* Sign out */}
        <button
          onClick={handleLogout}
          className={[
            'flex w-full items-center rounded-lg border border-ink-700 bg-transparent px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 transition hover:border-amber-500/50 hover:text-amber-600 dark:hover:text-amber-400',
            !isMobile && collapsed ? 'justify-center' : 'gap-2',
          ].join(' ')}
        >
          <IconLogout />
          <span
            className={[
              'overflow-hidden transition-all duration-300 whitespace-nowrap',
              !isMobile && collapsed ? 'w-0 opacity-0' : 'opacity-100',
            ].join(' ')}
          >
            Sign out
          </span>
        </button>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={toggleCollapsed}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden lg:flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-500 transition hover:bg-ink-800 hover:text-slate-900 dark:hover:text-slate-100"
        >
          {collapsed ? (
            <>
              <IconChevronRight />
            </>
          ) : (
            <>
              <IconChevronLeft />
              <span className="font-mono tracking-wide">Collapse</span>
            </>
          )}
        </button>
      </div>
    </>
  );

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen overflow-hidden bg-ink-950">

      {/* ── Mobile backdrop ── */}
      <div
        aria-hidden="true"
        onClick={() => setMobileOpen(false)}
        className={[
          'fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden',
          'transition-opacity duration-300',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
      />

      {/* ── Mobile drawer ── */}
      <aside
        aria-label="Mobile navigation"
        className={[
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col',
          'bg-ink-900 border-r border-ink-700 shadow-2xl',
          'transform transition-transform duration-300 ease-in-out',
          'lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {sidebarContent(true)}
      </aside>

      {/* ── Desktop sidebar (rail) ── */}
      <aside
        aria-label="Desktop navigation"
        className={[
          'hidden lg:flex flex-col shrink-0',
          'bg-ink-900 border-r border-ink-700',
          'transition-[width] duration-300 ease-in-out overflow-hidden',
          collapsed ? 'w-[72px]' : 'w-64',
        ].join(' ')}
      >
        {sidebarContent(false)}
      </aside>

      {/* ── Main content ── */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">

        {/* Mobile / tablet top bar */}
        <header className="flex lg:hidden items-center gap-3 h-[60px] shrink-0 border-b border-ink-700 bg-ink-900 px-4">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-ink-800 hover:text-slate-900 dark:hover:text-slate-100"
          >
            <IconMenu />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500 font-mono text-xs font-bold text-gray-900">
              L
            </div>
            <span className="font-mono text-sm font-bold tracking-wide text-slate-900 dark:text-slate-50">
              LOOMLINE
            </span>
          </div>

          {/* Right: theme + avatar */}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={toggle}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-ink-800 hover:text-amber-600 dark:hover:text-amber-400"
            >
              {theme === 'dark' ? <IconSun /> : <IconMoon />}
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500/20 font-mono text-sm font-bold text-teal-600 dark:text-teal-300 cursor-default select-none">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-blueprint bg-grid bg-ink-950">
          <div className="min-h-full dark:bg-ink-950/80 p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
