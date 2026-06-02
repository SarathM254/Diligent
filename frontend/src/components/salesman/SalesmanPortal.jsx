import { useState } from 'react';
import SalesmanProfile from './SalesmanProfile';
import BillSubmission from './BillSubmission';
import CashPayment from './CashPayment';

export default function SalesmanPortal({ activeUser }) {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto animate-fade-in">
      {/* Tab Navigation */}
      <div className="flex gap-2 p-1.5 mb-6 bg-gray-200/50 rounded-2xl shadow-inner backdrop-blur-sm">
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-3 px-2 text-sm font-bold rounded-xl transition-all duration-200 ${activeTab === 'profile' ? 'bg-white text-emerald-600 shadow-sm scale-100' : 'text-gray-500 hover:text-gray-700 scale-95'}`}
        >
          Profile
        </button>
        <button 
          onClick={() => setActiveTab('bill')}
          className={`flex-1 py-3 px-2 text-sm font-bold rounded-xl transition-all duration-200 ${activeTab === 'bill' ? 'bg-white text-emerald-600 shadow-sm scale-100' : 'text-gray-500 hover:text-gray-700 scale-95'}`}
        >
          Daily Run
        </button>
        <button 
          onClick={() => setActiveTab('cash')}
          className={`flex-1 py-3 px-2 text-sm font-bold rounded-xl transition-all duration-200 ${activeTab === 'cash' ? 'bg-white text-emerald-600 shadow-sm scale-100' : 'text-gray-500 hover:text-gray-700 scale-95'}`}
        >
          Settle
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 w-full pb-6">
        {activeTab === 'profile' && <SalesmanProfile activeUser={activeUser} />}
        {activeTab === 'bill' && <BillSubmission activeUser={activeUser} />}
        {activeTab === 'cash' && <CashPayment activeUser={activeUser} />}
      </div>
    </div>
  );
}
