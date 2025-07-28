// File: src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import './Dashboard.css';
 
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
    <div className="dashboard">
  <h2>Analytics Dashboard</h2>
 
  <div className="filters">
    {['Today', 'This Week', 'This Month', 'All Time'].map(label => (
      <button
        key={label}
        onClick={() => applyFilter(label)}
        className={`filter-button ${filter === label ? 'active' : ''}`}
      >
        {label}
      </button>
    ))}
  </div>
 
  <div className="summary">
    <div className="summary-card">
      <div className="label">All Time Total</div>
      <div className="value">฿{total.toFixed(2)}</div>
    </div>
    {filter !== 'All Time' && (
      <div className="summary-card alt">
        <div className="label">{filter} Total</div>
        <div className="value">฿{filteredTotal.toFixed(2)}</div>
      </div>
    )}
  </div>
 
  <div className="grid-section">
    <div className="card">
      <h4>Spending by Category</h4>
      {categoryData.length === 0 ? (
        <p className="no-data">No data</p>
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
 
    <div className="card">
      <h4>Recent Records</h4>
      <ul>
        {recent.length === 0 ? (
          <li className="no-data">No records yet.</li>
        ) : (
          recent.map((rec, i) => (
            <li key={i}>
              {rec.date} - {rec.category} - ฿{rec.amount.toFixed(2)}
            </li>
          ))
        )}
      </ul>
    </div>
  </div>
 
  <div className="full-width-chart">
    <h4>Monthly Spending</h4>
    {monthlyData.length === 0 ? (
      <p className="no-data">No data</p>
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