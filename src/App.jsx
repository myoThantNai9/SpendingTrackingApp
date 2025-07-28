import { Outlet, Link, useLocation } from 'react-router-dom';

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-50 py-6 px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Spending Tracker</h1>
        <div className="flex gap-4">
          <Link
            to="/"
            className={`px-4 py-2 rounded-md font-medium border ${
              location.pathname === '/' ? 'bg-green-400 text-white' : 'bg-white text-gray-800'
            }`}
          >
            Analytics Dashboard
          </Link>
          <Link
            to="/journal"
            className={`px-4 py-2 rounded-md font-medium border ${
              location.pathname === '/journal' ? 'bg-green-400 text-white' : 'bg-white text-gray-800'
            }`}
          >
            Expense Journal
          </Link>
        </div>
      </header>
      <main className="p-8">
        <Outlet />
      </main>
    </div>
  );
}