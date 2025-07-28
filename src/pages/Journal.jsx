import React, { useState, useEffect } from 'react';
import './Journal.css';
 
const predefinedCategories = [
  'Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Shopping', 'Other'
];
 
export default function Journal() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [date, setDate] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [records, setRecords] = useState(() => {
    const stored = localStorage.getItem('spendingRecords');
    return stored ? JSON.parse(stored) : [];
  });
  const [categories, setCategories] = useState(() => {
    const stored = localStorage.getItem('spendingCategories');
    return stored ? JSON.parse(stored) : [...predefinedCategories];
  });
 
  useEffect(() => {
    localStorage.setItem('spendingRecords', JSON.stringify(records));
  }, [records]);
 
  useEffect(() => {
    localStorage.setItem('spendingCategories', JSON.stringify(categories));
  }, [categories]);
 
  const handleAdd = () => {
    if (!date || !(selectedCategory || newCategory) || !amount) return;
    const category = newCategory || selectedCategory;
    const newRecord = { date, category, amount: Number(amount) };
    setRecords(prev => [...prev, newRecord]);
    setDate('');
    setSelectedCategory('');
    setNewCategory('');
    setAmount('');
  };
 
  const renderRecords = () => {
    if (records.length === 0) {
      return <div className="no-records">No spending records yet.</div>;
    }
    return (
      <div className="records-list">
        {records.map((rec, index) => (
          <div key={index} className="record-card">
            {rec.date} - {rec.category} - ฿{rec.amount.toFixed(2)}
          </div>
        ))}
      </div>
    );
  };
 
  return (
    <div className="journal-container">
      <div>
        <h2>Add Spending Record</h2>
        <div className="form-card">
          <div>
            <label>Date:</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
 
          <div className="category-row">
            <div style={{ flex: 1 }}>
              <label>Category:</label>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <input
              type="text"
              placeholder="New category"
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
            />
            <button
              className="button-primary"
              onClick={() => {
                if (newCategory.trim() && !categories.includes(newCategory.trim())) {
                  const trimmed = newCategory.trim();
                  setCategories([...categories, trimmed]);
                  setSelectedCategory(trimmed);
                  setNewCategory('');
                }
              }}
            >
              + Add Category
            </button>
          </div>
 
          <div>
            <label>Amount:</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </div>
 
          <button className="button-primary" onClick={handleAdd}>
            Add Record
          </button>
        </div>
      </div>
 
      <div>
        <h2>Spending Records</h2>
        {renderRecords()}
      </div>
    </div>
  );
}
 