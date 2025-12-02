import { Activity, Cpu, LayoutGrid, Lightbulb, Moon, Route as RouteIcon, Sun } from "lucide-react";
import React from "react";
import { Link, NavLink } from "react-router-dom";

interface NavBarProps {
  isDarkMode?: boolean;
  toggleTheme?: () => void;
}

const navItems = [
  {
    to: "/users-journey",
    label: "Users Journey",
    icon: <RouteIcon size={16} />,
  },
  { to: "/insights", label: "Insights", icon: <Lightbulb size={16} /> },
  { to: "/dashboards", label: "Dashboards", icon: <LayoutGrid size={16} /> },
  {
    to: "/session-replay",
    label: "Session Replay",
    icon: <Activity size={16} />,
  },
];

const NavBar: React.FC<NavBarProps> = ({ isDarkMode, toggleTheme }) => (
  <nav className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md">
    <div className="mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
      <Link
        to="/"
        className="inline-flex items-center gap-3 text-slate-900 dark:text-white font-semibold tracking-tight flex-shrink-0"
        title="Journey OS Home"
      >
        <div className="inline-flex items-center gap-2">
          <Cpu size={18} className="text-cyan-600 dark:text-cyan-400" />
          <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-slate-700 dark:text-slate-200">
            Journey_OS v1.0.0
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                isActive
                  ? "text-cyan-600 dark:text-cyan-300 border-cyan-200 dark:border-cyan-700 bg-cyan-50/60 dark:bg-cyan-900/20"
                  : "text-slate-600 dark:text-slate-300 border-transparent hover:text-cyan-600 dark:hover:text-cyan-300 hover:border-slate-200 dark:hover:border-slate-700"
              }`
            }
          >
            {item.icon}
            <span className="hidden sm:inline">{item.label}</span>
            <span className="sm:hidden">{item.label.split(" ")[0]}</span>
          </NavLink>
        ))}

        <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400 mr-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>SYSTEM ONLINE</span>
        </div>

        {toggleTheme && (
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 hover:border-cyan-200 dark:hover:border-cyan-700 transition-colors"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        )}
      </div>
    </div>
  </nav>
);

export default NavBar;
