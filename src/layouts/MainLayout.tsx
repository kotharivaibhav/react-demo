import { Outlet } from 'react-router-dom';
import { Header } from '@/components/common';

export const MainLayout = () => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Header />
    <main className="app-main">
      <Outlet />
    </main>
    <footer className="app-footer">Phase 1 — React Fundamentals Boilerplate</footer>
  </div>
);
