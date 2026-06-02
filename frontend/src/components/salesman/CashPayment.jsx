import { useState, useMemo } from 'react';
import api from '../../utils/api';

const DENOMINATIONS = [500, 200, 100, 50, 20, 10];

export default function CashPayment() {
  const [cashCounts, setCashCounts] = useState({});
  const [phonePeAmount, setPhonePeAmount] = useState('');

  const handleCashChange = (denom, val) => {
    setCashCounts(prev => ({ ...prev, [denom]: Number(val) }));
  };

  const totalHandCash = useMemo(() => {
    return DENOMINATIONS.reduce((sum, denom) => {
      const count = cashCounts[denom] || 0;
      return sum + (denom * count);
    }, 0);
  }, [cashCounts]);

  const totalPayment = totalHandCash + (Number(phonePeAmount) || 0);

  const handleSubmit = async () => {
    try {
      await api.post('/payments', {
        cashBreakdown: cashCounts,
        totalHandCash,
        phonePeAmount: Number(phonePeAmount) || 0,
        totalPayment
      });
      alert('Settlement submitted successfully!');
      setCashCounts({});
      setPhonePeAmount('');
    } catch (error) {
      console.error(error);
      alert('Failed to submit settlement.');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Cash & Digital Settlement</h2>
        <p className="text-sm text-gray-500 mt-1">Log today's cash collections and PhonePe transfers</p>
      </div>
      
      <div className="p-5 space-y-6">
        <div>
          <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            Hand Cash
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {DENOMINATIONS.map(denom => (
              <div key={denom} className="flex items-center bg-gray-50 p-2 rounded-xl border border-gray-100 transition-colors focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                <span className="w-12 text-sm font-bold text-gray-700">₹{denom}</span>
                <span className="text-gray-400 mx-1 text-xs">x</span>
                <input 
                  type="number"
                  inputMode="numeric"
                  min="0"
                  value={cashCounts[denom] || ''}
                  onChange={e => handleCashChange(denom, e.target.value)}
                  placeholder="0"
                  className="flex-1 w-full py-2 px-1 text-center font-bold text-gray-800 bg-transparent border-none focus:ring-0 outline-none"
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between items-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <span className="text-emerald-800 font-bold text-sm">Cash Subtotal</span>
            <span className="text-emerald-700 font-extrabold text-xl">₹{totalHandCash}</span>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            PhonePe / Digital
          </h3>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 font-bold">₹</span>
            <input 
              type="number"
              inputMode="numeric"
              min="0"
              value={phonePeAmount}
              onChange={e => setPhonePeAmount(e.target.value)}
              placeholder="0"
              className="w-full pl-8 pr-4 py-4 text-xl font-bold border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="p-5 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
        <div className="flex justify-between items-center mb-5">
          <span className="text-gray-500 font-bold uppercase tracking-wider text-sm">Total Settlement</span>
          <span className="text-3xl font-extrabold text-gray-900 tracking-tight">₹{totalPayment}</span>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={totalPayment === 0}
          className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-lg rounded-xl transition-all shadow-md active:scale-95"
        >
          Submit Settlement
        </button>
      </div>
    </div>
  );
}
