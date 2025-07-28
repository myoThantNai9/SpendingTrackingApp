// File: src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#f87171', '#3b82f6'];

export default function Dashboard() {
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);
  const [filteredTotal, setFilteredTotal] = useState(0);
  const [filter, setFilter] = useState('All Time');
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('spendingRecords');
    const data = stored ? JSON.parse(stored) : [];
    setRecords(data);
    setRecent(data.slice(-5).reverse());
    setTotal(data.reduce((sum, r) => sum + Number(r.amount), 0));
    applyFilter(filter, data);
    generateCategoryData(data);
    generateMonthlyData(data);
  }, []);

  const applyFilter = (type, data = records) => {
    const now = new Date();
    let filtered = data;

    if (type === 'This Month') {
      filtered = data.filter(r => {
        const d = new Date(r.date);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      });
    } else if (type === 'Today') {
      filtered = data.filter(r => r.date === now.toISOString().slice(0, 10));
    } else if (type === 'This Week') {
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      filtered = data.filter(r => {
        const d = new Date(r.date);
        return d >= start && d <= end;
      });
    }

    const sum = filtered.reduce((s, r) => s + Number(r.amount), 0);
    setFilteredTotal(sum);
    setFilter(type);
  };

  const generateCategoryData = (data) => {
    const grouped = {};
    data.forEach(r => {
      grouped[r.category] = (grouped[r.category] || 0) + Number(r.amount);
    });
    const pie = Object.entries(grouped).map(([name, value]) => ({ name, value }));
    setCategoryData(pie);
  };

  const generateMonthlyData = (data) => {
    const grouped = {};
    data.forEach(r => {
      const d = new Date(r.date);
      const label = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      grouped[label] = (grouped[label] || 0) + Number(r.amount);
    });
    const bar = Object.entries(grouped).map(([month, total]) => ({ month, total }));
    setMonthlyData(bar);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>
      <div className="mb-6 flex flex-wrap gap-3">
        {['Today', 'This Week', 'This Month', 'All Time'].map(label => (
          <button
            key={label}
            onClick={() => applyFilter(label)}
            className={`px-4 py-2 rounded-md border ${
              filter === label ? 'bg-green-400 text-white' : 'bg-white hover:bg-gray-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Spending Summary</h3>
        <div className="flex gap-4 flex-wrap">
          <div className="bg-green-50 p-4 rounded shadow w-64">
            <div className="text-sm text-gray-500">All Time Total</div>
            <div className="text-2xl font-bold">฿{total.toFixed(2)}</div>
          </div>
          {filter !== 'All Time' && (
            <div className="bg-green-100 p-4 rounded shadow w-64">
              <div className="text-sm text-gray-500">{filter} Total</div>
              <div className="text-2xl font-bold">฿{filteredTotal.toFixed(2)}</div>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow text-center">
          <h4 className="text-lg font-bold mb-4">Spending by Category</h4>
          {categoryData.length === 0 ? (
            <p className="text-gray-500">No data</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={90} label>
                  {categoryData.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h4 className="text-lg font-bold mb-4 text-center">Recent Records</h4>
          <ul className="text-left divide-y">
            {recent.length === 0 ? <li className="text-gray-500">No records yet.</li> :
              recent.map((rec, i) => (
                <li key={i} className="py-2">
                  {rec.date} - {rec.category} - ฿{rec.amount.toFixed(2)}
                </li>
              ))}
          </ul>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h4 className="text-lg font-bold mb-4 text-center">Monthly Spending</h4>
        {monthlyData.length === 0 ? (
          <p className="text-gray-500 text-center">No data</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}