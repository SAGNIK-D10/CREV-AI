import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import AIChatbot from './components/AIChatbot/AIChatbot';
import styles from './App.module.css';

export default function App() {
  return (
    <div className={styles.appShell}>
      <Sidebar />
      <main className={styles.mainArea}>
        <Outlet />
      </main>
      <AIChatbot />
    </div>
  );
}

