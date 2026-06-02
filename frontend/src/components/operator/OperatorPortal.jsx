import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function OperatorPortal() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDeliveredBills = () => {
    setLoading(true);
    // Fetch all pending bills, then filter for those marked 'delivered' by owner
    api.get('/bills/admin/pending')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        setBills(data.filter(b => b.status === 'delivered'));
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDeliveredBills();
    // Auto-poll every 15 seconds to sync state across the network
    const interval = setInterval(fetchDeliveredBills, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkBilled = async (id) => {
    try {
      await api.patch(`/bills/${id}/status`, { status: 'billed' });
      fetchDeliveredBills();
    } catch (err) {
      console.error(err);
      alert('Failed to mark as billed.');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full min-h-[500px] w-full max-w-md mx-auto animate-fade-in">
      <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-purple-50 rounded-t-2xl">
        <div>
          <h2 className="text-xl font-bold text-purple-800">Staging Queue</h2>
          <p className="text-xs text-purple-600 mt-1 font-bold uppercase tracking-wider">Pending Desktop Entry</p>
        </div>
        <button 
          onClick={fetchDeliveredBills}
          disabled={loading}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-bold py-2 px-3 rounded-lg shadow-sm transition-all active:scale-95 text-xs"
        >
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Feed
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50 rounded-b-2xl">
        {bills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            <p className="font-medium text-sm">No bills waiting for operator entry.</p>
          </div>
        ) : (
          bills.map(bill => (
            <div key={bill._id} className="bg-white p-5 rounded-xl shadow-sm border border-purple-100">
              <div className="flex justify-between items-start mb-4 pb-3 border-b border-gray-100">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{bill.salesmanName || 'Unknown Salesman'}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 font-medium">{bill.date ? new Date(bill.date).toLocaleDateString() : 'N/A'}</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase tracking-wide">
                      Delivered
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-xs font-bold text-gray-400 uppercase">Final Total</span>
                  <span className="text-2xl font-extrabold text-purple-700">₹{bill.totalAmount}</span>
                </div>
              </div>

              <div className="mb-5 bg-purple-50/50 rounded-lg p-3 border border-purple-50">
                <h4 className="text-xs font-bold text-purple-800 uppercase tracking-wider mb-2">Line Items</h4>
                <ul className="space-y-1.5">
                  {bill.items && bill.items.length > 0 ? bill.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center text-sm border-b border-purple-100/50 pb-1 last:border-0 last:pb-0">
                      <span className="font-medium text-gray-700">{item.brandName || item.brandId}</span>
                      <div className="text-right flex items-center gap-2">
                        <span className="text-xs text-purple-600/70">@ ₹{item.rateSnapShot || 0}</span>
                        <span className="font-bold text-gray-900 bg-white px-2 py-0.5 rounded shadow-sm text-xs">x {item.quantity}</span>
                      </div>
                    </li>
                  )) : (
                    <li className="text-sm text-gray-400 italic">No specific items listed in payload.</li>
                  )}
                </ul>
              </div>

              <button 
                onClick={() => handleMarkBilled(bill._id)}
                className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Mark as Logged/Billed
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
