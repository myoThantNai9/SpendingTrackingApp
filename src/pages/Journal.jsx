import React, { useState, useEffect } from 'react';

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
      return <div className="p-6 rounded-lg bg-green-50 text-gray-700">No spending records yet.</div>;
    }
    return (
      <ul className="space-y-2">
        {records.map((rec, index) => (
          <li key={index} className="bg-white p-4 rounded shadow">
            {rec.date} - {rec.category} - ฿{rec.amount.toFixed(2)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div>
        <h2 className="text-2xl font-bold mb-6">Add Spending Record</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block font-semibold mb-1">Date:</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border rounded p-2" />
          </div>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex-1">
              <label className="block font-semibold mb-1">Category:</label>
              <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="w-full border rounded p-2">
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
              className="border rounded p-2"
            />
            <button
              className="bg-green-400 text-white px-3 py-2 rounded"
              onClick={() => {
                if (newCategory && !categories.includes(newCategory)) {
                  setCategories([...categories, newCategory]);
                  setSelectedCategory(newCategory);
                  setNewCategory('');
                }
              }}
            >
              + Add Category
            </button>
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Amount:</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full border rounded p-2" />
          </div>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded" onClick={handleAdd}>Add Record</button>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-6">Spending Records</h2>
        {renderRecords()}
      </div>
    </div>
  );
}