import { useState } from 'react';
import './App.css';
import SalesmanPortal from './components/salesman/SalesmanPortal';

export default function App() {
  const [role, setRole] = useState('none'); // 'none', 'owner', 'operator', 'salesman'

  const handleLogout = () => {
    setRole('none');
  };

  if (role === 'none') {
    return (
      <div className="w-full max-w-md mx-auto p-4 min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full flex flex-col gap-6 text-center">
          <h1 className="text-3xl font-extrabold text-blue-600 mb-2">Manikyapriya Agencies</h1>
          <p className="text-gray-500 mb-6">Select your portal to continue</p>
          
          <button 
            onClick={() => setRole('owner')}
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-95"
          >
            Enter Owner Portal
          </button>
          
          <button 
            onClick={() => setRole('operator')}
            className="w-full py-4 px-6 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-95"
          >
            Enter Operator Portal
          </button>
          
          <button 
            onClick={() => setRole('salesman')}
            className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-95"
          >
            Enter Salesman Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="flex items-center justify-between bg-white shadow-md rounded-xl p-4 mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800 capitalize">{role} Portal</h2>
          <p className="text-xs text-gray-500 font-medium">Manikyapriya Agencies</p>
        </div>
        <button 
          onClick={handleLogout}
          className="text-sm font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors shadow-sm"
        >
          Switch Role / Logout
        </button>
      </header>
      
      {role === 'salesman' ? (
        <main className="flex-1 w-full pb-4">
          <SalesmanPortal />
        </main>
      ) : (
        <main className="flex-1 bg-white shadow-md rounded-xl p-6 flex flex-col items-center justify-center">
          {/* Placeholder for real-time portal data */}
          <div className="text-center">
            <span className="inline-block p-4 rounded-full bg-blue-50 mb-4">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </span>
            <h3 className="text-xl font-bold text-gray-800 mb-2 capitalize">{role} Dashboard</h3>
            <p className="text-gray-500 text-sm">Real-time data updates will appear here.</p>
          </div>
        </main>
      )}
    </div>
  );
}
