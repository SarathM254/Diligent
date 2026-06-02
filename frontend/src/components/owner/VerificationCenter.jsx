import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function VerificationCenter() {
  const [bills, setBills] = useState([]);
  const [payments, setPayments] = useState([]);

  const fetchData = () => {
    api.get('/bills/admin/pending')
      .then(res => setBills(res.data || []))
      .catch(() => {
        // Mock data
        setBills([
          { _id: 'b1', salesmanName: 'Ramesh', totalAmount: 12500, status: 'submitted', date: 'Today' }
        ]);
      });

    api.get('/payments/pending')
      .then(res => setPayments(res.data || []))
      .catch(() => {
        // Mock data
        setPayments([
          { _id: 'p1', salesmanName: 'Suresh', totalPayment: 8500, status: 'unverified', totalHandCash: 5000, phonePeAmount: 3500 }
        ]);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBillStatus = async (id, status) => {
    try {
      await api.patch(`/bills/${id}/status`, { status });
      alert(`Bill status updated to: ${status}`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Mock updated for UI demonstration');
      setBills(prev => prev.filter(b => b._id !== id));
    }
  };

  const handleVerifyPayment = async (id) => {
    try {
      await api.patch(`/payments/${id}/verify`);
      alert('Payment verified & balance deducted!');
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Mock verified for UI demonstration');
      setPayments(prev => prev.filter(p => p._id !== id));
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      {/* Pending Bills */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-orange-50 rounded-t-2xl">
          <h2 className="text-lg font-bold text-orange-800">Pending Daily Runs</h2>
        </div>
        <div className="p-4 space-y-3">
          {bills.length === 0 ? (
             <p className="text-gray-500 text-sm text-center py-4">No pending bills</p>
          ) : bills.map(b => (
            <div key={b._id} className="border border-orange-100 bg-white p-4 rounded-xl shadow-sm">
              <div className="flex justify-between mb-3">
                <span className="font-bold text-gray-800">{b.salesmanName}</span>
                <span className="font-extrabold text-gray-900">₹{b.totalAmount}</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleBillStatus(b._id, 'delivered')}
                  className="flex-1 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 text-sm"
                >
                  Mark Delivered
                </button>
                <button 
                  onClick={() => handleBillStatus(b._id, 'date_push')}
                  className="flex-1 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 text-sm"
                >
                  Date Push
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Settlements */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-blue-50 rounded-t-2xl">
          <h2 className="text-lg font-bold text-blue-800">Unverified Settlements</h2>
        </div>
        <div className="p-4 space-y-3">
          {payments.length === 0 ? (
             <p className="text-gray-500 text-sm text-center py-4">No pending settlements</p>
          ) : payments.map(p => (
            <div key={p._id} className="border border-blue-100 bg-white p-4 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <span className="block font-bold text-gray-800">{p.salesmanName}</span>
                  <span className="block text-xs text-gray-500">Cash: ₹{p.totalHandCash} | Digital: ₹{p.phonePeAmount}</span>
                </div>
                <span className="font-extrabold text-blue-600 text-xl">₹{p.totalPayment}</span>
              </div>
              <button 
                onClick={() => handleVerifyPayment(p._id)}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-sm active:scale-95 transition-all"
              >
                Verify & Clear Cash
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
