import { useState, useEffect, useMemo } from 'react';
import api from '../../utils/api';

export default function BillSubmission() {
  const [brands, setBrands] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [status, setStatus] = useState('draft'); // draft, submitted

  useEffect(() => {
    api.get('/brands')
      .then(res => {
        // Assume res.data might be the array, or res.data.brands
        const data = Array.isArray(res.data) ? res.data : (res.data.brands || []);
        setBrands(data);
      })
      .catch(err => {
        console.error('Error fetching brands:', err);
        // Fallback for UI testing if endpoint is empty
        setBrands([
          { _id: '1', name: 'Premium Brand A', retailPrice: 150 },
          { _id: '2', name: 'Standard Brand B', retailPrice: 300 },
          { _id: '3', name: 'Economy Brand C', retailPrice: 50 },
        ]);
      });
  }, []);

  const handleQtyChange = (id, val) => {
    if (status !== 'draft') return;
    setQuantities(prev => ({ ...prev, [id]: Number(val) }));
  };

  const totalValue = useMemo(() => {
    return brands.reduce((sum, brand) => {
      const qty = quantities[brand._id] || 0;
      return sum + (qty * (brand.retailPrice || 0));
    }, 0);
  }, [brands, quantities]);

  const handleSubmit = async () => {
    try {
      const items = brands.map(b => ({
        brandId: b._id,
        quantity: quantities[b._id] || 0
      })).filter(item => item.quantity > 0);

      await api.post('/bills', { items, totalAmount: totalValue });
      setStatus('submitted');
      alert('Daily Run Bill submitted successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to submit bill.');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col min-h-[400px]">
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Daily Run - Bill Submission</h2>
        <p className="text-sm text-gray-500 mt-1">Enter quantities for today's run</p>
      </div>
      
      <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-gray-50">
        {brands.map(brand => (
          <div key={brand._id} className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div>
              <p className="font-bold text-gray-800">{brand.name}</p>
              <p className="text-sm font-medium text-emerald-600">₹{brand.retailPrice} / unit</p>
            </div>
            <input 
              type="number" 
              inputMode="numeric"
              min="0"
              value={quantities[brand._id] || ''}
              onChange={e => handleQtyChange(brand._id, e.target.value)}
              disabled={status !== 'draft'}
              placeholder="0"
              className="w-20 p-3 text-center text-lg font-bold border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all disabled:bg-gray-100"
            />
          </div>
        ))}
      </div>

      <div className="p-5 border-t border-gray-200 bg-white rounded-b-2xl">
        <div className="flex justify-between items-center mb-5">
          <span className="text-gray-500 font-bold uppercase tracking-wider text-sm">Total Value</span>
          <span className="text-3xl font-extrabold text-gray-900 tracking-tight">₹{totalValue}</span>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={status !== 'draft' || totalValue === 0}
          className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-lg rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
        >
          {status === 'draft' ? (
            <>
              <span>Submit Daily Run</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              <span>Submitted (Locked)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
