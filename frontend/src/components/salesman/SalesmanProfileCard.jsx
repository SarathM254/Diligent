import React, { useState, useEffect } from 'react';
import { getSalesmanDailyStatus } from '../../api/userApi';

export default function SalesmanProfileCard({ salesman, onNavigateToBilling, onNavigateToCash, onNavigateToPrices, onBackToList }) {
  const [billStatus, setBillStatus] = useState('Loading...');
  const [cashStatus, setCashStatus] = useState('Loading...');

  useEffect(() => {
    if (salesman && salesman._id) {
      getSalesmanDailyStatus(salesman._id)
        .then(data => {
          setBillStatus(data.billStatus);
          setCashStatus(data.cashStatus);
        })
        .catch(err => {
          console.error("Failed to load daily status", err);
          setBillStatus('Error');
          setCashStatus('Error');
        });
    }
  }, [salesman]);

  if (!salesman) return null;

  let symb = "";
  if (salesman.name) {
    symb += salesman.name[0];
    symb += salesman.name[1];
  }

  return (
    <div className="w-full max-w-md bg-slate-50">
      {/* Container Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5">
        
        {/* Header Layout */}
        <div className="flex items-start justify-between">
          <div>
            {onBackToList && (
              <button onClick={onBackToList} className="flex items-center text-[11px] font-bold text-slate-400 hover:text-indigo-600 mb-2 transition-colors uppercase tracking-wider">
                <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                Agent List
              </button>
            )}
            <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-none">
              {salesman.name}
            </h2>
            <p className="text-xs font-semibold text-indigo-600 tracking-wider uppercase mt-1">
              ID: {salesman.code}
            </p>
          </div>
          
          {/* Subtle User Initials Badge */}
          <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
            {symb}
          </div>
        </div>

        {/* Info Divider Line */}
        <hr className="my-4 border-slate-200" />

        {/* Financial metrics display box */} 

        <div className='flex flex-col space-y-3'>
          <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3.5 px-7 border border-slate-100">
            <span className="text-xl font-bold text-slate-700 tracking-wide">
              BF:
            </span>
            {/* Dynamic color warning: Green if 0, Red badge if debt exists */}
            <div className={`px-3 py-1.5 rounded-lg font-bold text-base tracking-tight ${salesman.bf > 0
                ? 'bg-rose-50 text-rose-700 border border-rose-100'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
              }`}>
              ₹{salesman.bf.toLocaleString('en-IN')}
            </div>
          </div>



{/* this part needs to be remvoed from comments */}

           <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3.5 px-7 border border-slate-100">
            <span className="text-xl font-bold text-slate-700 tracking-wide">
              Bill Status:
            </span>
            
            <div className={`px-3 py-1.5 rounded-full font-bold text-base tracking-tight ${
              billStatus === 'Verified' ? 'bg-emerald-100 text-emerald-700 border border-emerald-600' :
              billStatus === 'Unverified' ? 'bg-amber-100 text-amber-700 border border-amber-500' :
              'bg-slate-300 text-slate-600 border border-slate-600'
            }`}>
              {billStatus}
            </div>
          </div>
          <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3.5 px-7 border border-slate-100">
            <span className="text-xl font-bold text-slate-700 tracking-wide">
              Cash Status:
            </span>
            
            <div className={`px-3 py-1.5 rounded-full font-bold text-base tracking-tight ${
              cashStatus === 'Verified' ? 'bg-emerald-100 text-emerald-700 border border-emerald-600' :
              cashStatus === 'Unverified' ? 'bg-amber-100 text-amber-700 border border-amber-500' :
              'bg-slate-300 text-slate-600 border border-slate-600'
            }`}>
              {cashStatus}
            </div>
          </div> 

          <div className="flex items-center justify-between rounded-xl space-x-2">
            <button type="button" onClick={onNavigateToBilling} className="flex-1 flex justify-center px-3 py-2 rounded-lg font-bold text-base tracking-tight bg-indigo-600 text-indigo-50 border border-emerald-100 transition duration-150 ease-in-out active:scale-95 active:bg-indigo-700">
              Bill
            </button>
            <button type="button" onClick={onNavigateToCash} className="flex-1 flex justify-center px-3 py-2 rounded-lg font-bold text-base tracking-tight bg-emerald-600 text-emerald-50 border border-emerald-100 transition duration-150 ease-in-out active:scale-95 active:bg-emerald-700">
              Cash Pay
            </button>
            <button type="button" onClick={onNavigateToPrices} className={`flex-1 flex justify-center px-3 py-2 rounded-lg font-bold text-base tracking-tight transition duration-150 ease-in-out active:scale-95 ${salesman.bf > 0
                ? 'bg-rose-700 text-rose-50 border border-rose-100 active:bg-rose-800'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-100 active:bg-emerald-100'
              }`}>
              Prices
            </button>
          </div>


        </div>

      </div>
    </div>
  );
}