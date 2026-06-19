import React, { useState, useEffect } from 'react';
import { getSalesmanDailyStatus } from '../../api/userApi';
import { useNavigate } from 'react-router-dom';

export default function SalesmanProfileCard({ salesman }) {
  const navigate = useNavigate();
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
  if (salesman.code) {
    symb += salesman.code[0];
    symb += salesman.code[1];
  }

  return (
    <div className="w-full max-w-md bg-slate-50">
      {/* Container Card */}
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-slate-200/60 p-4">
        
        {/* Header Layout */}
        <div className="flex items-start justify-between">
          <div>
            <button onClick={() => navigate(-1)} className="flex items-center text-[11px] font-bold text-slate-400 hover:text-indigo-600 mb-2 transition-colors uppercase tracking-wider">
              <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
              Agent List
            </button>
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
        <hr className="my-3.5 border-slate-100" />

        {/* Financial metrics display box */} 

        <div className='flex flex-col space-y-2.5'>
          <div className="flex items-center justify-between bg-slate-50/50 rounded-xl p-3 px-4 border border-slate-100/50">
            <span className="text-sm font-semibold text-slate-500 tracking-wide">
              BF Balance
            </span>
            {/* Dynamic color warning: Green if 0, Red badge if debt exists */}
            <div className={`px-2.5 py-1 rounded-lg font-bold text-sm tracking-tight ${salesman.bf > 0
                ? 'bg-rose-50 text-rose-700 border border-rose-100'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
              }`}>
              ₹{salesman.bf.toLocaleString('en-IN')}
            </div>
          </div>

           <div className="flex items-center justify-between bg-slate-50/50 rounded-xl p-3 px-4 border border-slate-100/50">
            <span className="text-sm font-semibold text-slate-500 tracking-wide">
              Bill Status
            </span>
            
            <div className={`px-2.5 py-1 rounded-full font-bold text-xs tracking-tight uppercase ${
              billStatus === 'Verified' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
              billStatus === 'Unverified' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
              'bg-slate-100 text-slate-500 border border-slate-200'
            }`}>
              {billStatus}
            </div>
          </div>
          <div className="flex items-center justify-between bg-slate-50/50 rounded-xl p-3 px-4 border border-slate-100/50">
            <span className="text-sm font-semibold text-slate-500 tracking-wide">
              Cash Status
            </span>
            
            <div className={`px-2.5 py-1 rounded-full font-bold text-xs tracking-tight uppercase ${
              cashStatus === 'Verified' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
              cashStatus === 'Unverified' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
              'bg-slate-100 text-slate-500 border border-slate-200'
            }`}>
              {cashStatus}
            </div>
          </div> 

          <div className="flex gap-2">
            <button type="button" onClick={() => navigate('/salesman/billing')} className="flex-1 flex justify-center px-3 py-2.5 rounded-lg font-bold text-sm tracking-tight bg-indigo-600 text-white shadow-[0_2px_10px_rgb(79,70,229,0.2)] transition duration-150 ease-in-out active:scale-95 active:bg-indigo-700">
              Supply
            </button>
            <button type="button" onClick={() => navigate('/salesman/cash')} className="flex-1 flex justify-center px-3 py-2.5 rounded-lg font-bold text-sm tracking-tight bg-emerald-600 text-white shadow-[0_2px_10px_rgb(5,150,105,0.2)] transition duration-150 ease-in-out active:scale-95 active:bg-emerald-700">
              Collect
            </button>
            <button type="button" onClick={() => navigate('/salesman/prices')} className={`flex-1 flex justify-center px-3 py-2.5 rounded-lg font-bold text-sm tracking-tight transition duration-150 ease-in-out active:scale-95 ${salesman.bf > 0
                ? 'bg-rose-50 text-rose-700 border border-rose-100 active:bg-rose-100'
                : 'bg-slate-50 text-slate-600 border border-slate-200 active:bg-slate-100'
              }`}>
              Prices
            </button>
          </div>


        </div>

      </div>
    </div>
  );
}