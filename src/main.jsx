import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter basename="/SpendingTrackingApp">
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Dashboard />} />
          <Route path="journal" element={<Journal />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
