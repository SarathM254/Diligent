import { useState } from 'react';
import VerificationCenter from './VerificationCenter';
import BrandManager from './BrandManager';
import LedgerControl from './LedgerControl';
import UserProvisioner from './UserProvisioner';

export default function OwnerPortal() {
  const [activeTab, setActiveTab] = useState('verification');

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto animate-fade-in">
      {/* Tab Navigation */}
      <div className="flex gap-2 p-1.5 mb-6 bg-gray-200/50 rounded-2xl shadow-inner backdrop-blur-sm">
        <button 
          onClick={() => setActiveTab('verification')}
          className={`flex-1 py-3 px-1 text-sm font-bold rounded-xl transition-all duration-200 ${activeTab === 'verification' ? 'bg-white text-blue-600 shadow-sm scale-100' : 'text-gray-500 hover:text-gray-700 scale-95'}`}
        >
          Verification
        </button>
        <button 
          onClick={() => setActiveTab('brands')}
          className={`flex-1 py-3 px-1 text-sm font-bold rounded-xl transition-all duration-200 ${activeTab === 'brands' ? 'bg-white text-blue-600 shadow-sm scale-100' : 'text-gray-500 hover:text-gray-700 scale-95'}`}
        >
          Brands
        </button>
        <button 
          onClick={() => setActiveTab('ledger')}
          className={`flex-1 py-3 px-1 text-sm font-bold rounded-xl transition-all duration-200 ${activeTab === 'ledger' ? 'bg-white text-blue-600 shadow-sm scale-100' : 'text-gray-500 hover:text-gray-700 scale-95'}`}
        >
          Ledger
        </button>
        <button 
          onClick={() => setActiveTab('staff')}
          className={`flex-1 py-3 px-1 text-sm font-bold rounded-xl transition-all duration-200 ${activeTab === 'staff' ? 'bg-white text-blue-600 shadow-sm scale-100' : 'text-gray-500 hover:text-gray-700 scale-95'}`}
        >
          Staff
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 w-full pb-6">
        {activeTab === 'verification' && <VerificationCenter />}
        {activeTab === 'brands' && <BrandManager />}
        {activeTab === 'ledger' && <LedgerControl />}
        {activeTab === 'staff' && <UserProvisioner />}
      </div>
    </div>
  );
}
