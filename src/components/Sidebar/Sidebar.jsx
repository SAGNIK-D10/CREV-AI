import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './Sidebar.module.css';

const navItems = [
  { path: '/', label: 'Review', icon: '⬡' },
  { path: '/history', label: 'History', icon: '≡' },
  { path: '/settings', label: 'Settings', icon: '⊕' }
];

export default function Sidebar() {
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <span className={styles.logoText}>CREV</span>
        <span className={styles.aiBadge}>AI</span>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item, index) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''} ${mounted ? styles.mounted : ''}`
            }
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <span className={styles.icon}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.bottomSection}>
        <button className={styles.themeToggle} onClick={toggleTheme}>
          {theme === 'dark' ? '☼ Light Mode' : '☾ Dark Mode'}
        </button>

        <div className={styles.userSection}>
          <div className={styles.avatar}>SD</div>
          <span className={styles.username}>sagnik</span>
          <span className={styles.statusDot}></span>
        </div>
      </div>
    </div>
  );
}
