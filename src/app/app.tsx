// apps/calculator/src/app/app.tsx
import React, { useState, useEffect } from 'react';
import './app.scss';
import Calculator from './apps/calculator/src/app/components/Calculator/Calculator';

// Type for theme
type Theme = 'light' | 'dark' | 'system';

export function App() {
  const [theme, setTheme] = useState<Theme>('system');

  // Apply theme to body for global theming
  useEffect(() => {
    document.body.classList.remove('light-theme', 'dark-theme', 'system-theme');
    document.body.classList.add(`${theme}-theme`);

    // Store preference
    localStorage.setItem('calculator-theme', theme);
  }, [theme]);

  // Load saved theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('calculator-theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <div className={`app ${theme}-theme`}>
      <header className="app-header">
        <h1>React Calculator</h1>
        <div className="theme-selector">
          <label htmlFor="theme-select">Theme:</label>
          <select
            id="theme-select"
            value={theme}
            onChange={(e) => handleThemeChange(e.target.value as Theme)}
            className="theme-select"
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </header>
      <main className="app-main">
        <Calculator />
      </main>
      <footer className="app-footer">
        <p>Built with React {React.version} and Nx</p>
      </footer>
    </div>
  );
}

export default App;
