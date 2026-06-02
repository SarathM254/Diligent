import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function LedgerControl() {
  const [salesmen, setSalesmen] = useState([]);

  const fetchSalesmen = () => {
    api.get('/users/salesmen')
      .then(res => setSalesmen(res.data || []))
      .catch(err => {
        console.error(err);
      });
  };

  useEffect(() => {
    fetchSalesmen();
  }, []);

  const handleAdjust = async (id, name, type) => {
    const input = window.prompt(`Enter amount to ${type === 'add' ? 'ADD to' : 'SUBTRACT from'} ${name}'s balance:`);
    if (!input || isNaN(input)) return;
    
    let amount = Number(input);
    if (type === 'subtract') amount = -amount;

    try {
      await api.patch('/users/adjust-balance', { userId: id, amount });
      alert('Ledger adjusted successfully');
      fetchSalesmen();
    } catch (err) {
      console.error(err);
      alert('Failed to adjust ledger balance.');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col min-h-[400px]">
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Master Ledger</h2>
        <p className="text-sm text-gray-500 mt-1">Manual overrides for Salesmen BF</p>
      </div>
      
      <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-gray-50 rounded-b-2xl">
        {salesmen.map(s => (
          <div key={s._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-gray-800 text-lg">{s.name}</span>
              <div className="text-right">
                <span className="block text-xs text-gray-400 font-bold uppercase">Current BF</span>
                <span className={`text-xl font-extrabold ${(s.broughtForwardDebt || 0) > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                  ₹{s.broughtForwardDebt || 0}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => handleAdjust(s._id, s.name, 'add')}
                className="flex-1 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-all border border-red-100 active:scale-95"
              >
                + Add
              </button>
              <button 
                onClick={() => handleAdjust(s._id, s.name, 'subtract')}
                className="flex-1 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 font-bold rounded-xl transition-all border border-emerald-100 active:scale-95"
              >
                - Subtract
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
