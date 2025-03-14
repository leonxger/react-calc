// apps/calculator/src/app/app.tsx
import React from 'react';
import './app.scss';
import Calculator from './components/Calculator/Calculator';
import { useTheme } from './hooks/useTheme';
import { Theme } from './types';

/**
 * Main App component
 */
export function App() {
  const { theme, handleThemeChange } = useTheme('calculator-theme', 'system');

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
            aria-label="Select theme"
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
        <p>Built with React {React.version}</p>
      </footer>
    </div>
  );
}

export default App;
