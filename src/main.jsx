import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import ReviewPage from './pages/ReviewPage';
import HistoryPage from './pages/HistoryPage';
import { ThemeProvider } from './contexts/ThemeContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<ReviewPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="settings" element={<div style={{ padding: '40px', color: 'var(--text-muted)' }}>Settings View (Placeholder)</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
