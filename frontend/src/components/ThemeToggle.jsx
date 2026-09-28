import React, { useContext } from 'react';
import { Moon, Sun } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const dark = theme === 'dark';
  return (
    <button type="button" role="switch" aria-checked={dark} aria-label="Dark mode"
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggleTheme} className="theme-toggle">
      <span className="theme-toggle-track" aria-hidden="true">
        <Sun className="theme-toggle-sun" size={14} />
        <Moon className="theme-toggle-moon" size={14} />
        <span className="theme-toggle-thumb" />
      </span>
    </button>
  );
}
