import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function VerificationCenter() {
  const [bills, setBills] = useState([]);
  const [payments, setPayments] = useState([]);

  const fetchData = () => {
    api.get('/bills/admin/pending')
      .then(res => {
        const allBills = res.data || [];
        setBills(allBills.filter(b => b.status === 'submitted'));
      })
      .catch((err) => {
        console.error('Failed to fetch pending bills:', err);
      });

    api.get('/payments/pending')
      .then(res => setPayments(res.data || []))
      .catch((err) => {
        console.error('Failed to fetch pending payments:', err);
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
      alert('Failed to update bill status.');
    }
  };

  const handleVerifyPayment = async (id) => {
    try {
      await api.patch(`/payments/${id}/verify`);
      alert('Payment verified & balance deducted!');
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to verify payment.');
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
              <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-100">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{b.salesmanName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 font-medium">{b.date ? new Date(b.date).toLocaleDateString() : 'N/A'}</span>
                    <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wider">
                      {b.status}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase">Final Total</span>
                  <span className="font-extrabold text-gray-900 text-xl">₹{b.totalAmount}</span>
                </div>
              </div>

              {b.items && b.items.length > 0 && (
                <div className="mb-4 bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Itemized Breakdown</h4>
                  <ul className="space-y-1.5">
                    {b.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between items-center text-sm border-b border-gray-100 pb-1 last:border-0 last:pb-0">
                        <span className="font-medium text-gray-700">{item.brandName || item.brandId}</span>
                        <div className="text-right flex items-center gap-2">
                          <span className="text-xs text-gray-500">@ ₹{item.rateSnapShot || 0}</span>
                          <span className="font-bold text-gray-900 bg-white px-2 py-0.5 rounded shadow-sm text-xs">x {item.quantity}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex">
                <button 
                  onClick={() => handleBillStatus(b._id, 'delivered')}
                  className="flex-1 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 text-sm"
                >
                  Mark Delivered
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
