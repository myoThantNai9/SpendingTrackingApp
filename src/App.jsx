import { Outlet, Link, useLocation } from 'react-router-dom';
import './App.css';
 
export default function App() {
  const location = useLocation();
 
  return (
    <div className="container">
      <header>
        <h1>Spending Tracker</h1>
        <nav className="nav-links">
          <Link
            to="/"
            className={location.pathname === '/' ? 'active' : ''}
          >
            Analytics Dashboard
          </Link>
          <Link
            to="/journal"
            className={location.pathname === '/journal' ? 'active' : ''}
          >
            Expense Journal
          </Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}