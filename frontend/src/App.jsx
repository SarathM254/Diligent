import { useState, useEffect } from 'react';
import './App.css';
import SalesmanPortal from './components/salesman/SalesmanPortal';
import OwnerPortal from './components/owner/OwnerPortal';
import OperatorPortal from './components/operator/OperatorPortal';
import api from './utils/api';

export default function App() {
  const [role, setRole] = useState('none'); // 'none', 'owner', 'operator', 'salesman'
  const [activeUser, setActiveUser] = useState(null);
  const [selectingFor, setSelectingFor] = useState(null);
  const [userList, setUserList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const handleLogout = () => {
    setRole('none');
    setActiveUser(null);
    setSelectingFor(null);
  };

  const initRoleSelection = async (targetRole) => {
    if (targetRole === 'owner') {
      setRole('owner');
      return;
    }
    
    setSelectingFor(targetRole);
    setLoadingUsers(true);
    try {
      const endpoint = targetRole === 'salesman' ? '/users/salesmen' : '/users/operators';
      const res = await api.get(endpoint);
      setUserList(res.data || []);
    } catch (err) {
      console.error(err);
      setUserList([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const lockUserContext = (user) => {
    setActiveUser(user);
    setRole(selectingFor);
    setSelectingFor(null);
  };

  if (selectingFor) {
    return (
      <div className="w-full max-w-md mx-auto p-4 min-h-screen flex flex-col items-center bg-gray-50 text-gray-900 pt-10 animate-fade-in">
        <div className="w-full mb-6">
          <button 
            onClick={() => setSelectingFor(null)}
            className="text-blue-600 font-bold hover:underline mb-2 inline-block"
          >
            &larr; Back
          </button>
          <h2 className="text-2xl font-bold capitalize text-gray-800">Select {selectingFor}</h2>
          <p className="text-gray-500 text-sm">Choose your profile to log in</p>
        </div>

        {loadingUsers ? (
          <p className="text-gray-500 font-medium animate-pulse">Loading profiles...</p>
        ) : userList.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center w-full animate-fade-in">
            <p className="text-red-500 font-bold mb-2">No Profiles Found</p>
            <p className="text-gray-500 text-sm">No {selectingFor} profiles created yet. Please ask the Owner to provision your profile.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 w-full animate-fade-in">
            {userList.map(user => (
              <button
                key={user._id}
                onClick={() => lockUserContext(user)}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:border-blue-300 hover:shadow-md transition-all text-left active:scale-95"
              >
                <div>
                  <p className="font-bold text-gray-800 text-lg">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                {user.salesmanId && (
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-lg">
                    {user.salesmanId}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (role === 'none') {
    return (
      <div className="w-full max-w-md mx-auto p-4 min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full flex flex-col gap-6 text-center">
          <h1 className="text-3xl font-extrabold text-blue-600 mb-2">Manikyapriya Agencies</h1>
          <p className="text-gray-500 mb-6">Select your portal to continue</p>
          
          <button 
            onClick={() => initRoleSelection('owner')}
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-95"
          >
            Enter Owner Portal
          </button>
          
          <button 
            onClick={() => initRoleSelection('operator')}
            className="w-full py-4 px-6 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-95"
          >
            Enter Operator Portal
          </button>
          
          <button 
            onClick={() => initRoleSelection('salesman')}
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
          <p className="text-xs text-gray-500 font-medium">
            {activeUser ? `Logged in as: ${activeUser.name}` : 'Manikyapriya Agencies'}
          </p>
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
          <SalesmanPortal activeUser={activeUser} />
        </main>
      ) : role === 'owner' ? (
        <main className="flex-1 w-full pb-4">
          <OwnerPortal />
        </main>
      ) : role === 'operator' ? (
        <main className="flex-1 w-full pb-4">
          <OperatorPortal activeUser={activeUser} />
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
