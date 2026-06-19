import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import './App.css';
import apiClient from './api/apiClient';

// Owner Components
import OwnerDashboard from './components/owner/dashboard/OwnerDashboard';
import VerificationDesk from './components/owner/verification/VerificationDesk';
import LedgerControlPortal from './components/owner/ledger/LedgerControlPortal';
import StaffManagementPortal from './components/owner/staff/StaffManagementPortal';
import InventoryControlPortal from './components/owner/inventory/InventoryControlPortal';
import BrandManagerPortal from './components/owner/brand/BrandManagerPortal';

// Operator Components
import OperatorDashboard from './components/operator/OperatorDashboard';
import OperatorSelectionList from './components/operator/OperatorSelectionList';

// Salesman Components
import CashPaymentSettlement from './components/salesman/CashPaymentSettlement';
import SalesmanProfileCard from './components/salesman/SalesmanProfileCard';
import SalesmanStatementHistory from './components/salesman/SalesmanStatementHistory';
import SalesmanBillingScreen from './components/salesman/SalesmanBillingScreen';
import SalesmanSelectionList from './components/salesman/SalesmanSelectionList';
import SalesmanPriceList from './components/salesman/SalesmanPriceList';

export default function App() {
  const [role, setRole] = useState(() => {
    return localStorage.getItem('session_role') || 'none';
  });

  // operator state
  const [activeOperator, setActiveOperator] = useState(() => {
    const userJson = localStorage.getItem('session_user');
    const storedRole = localStorage.getItem('session_role');
    return (userJson && storedRole === 'operator') ? JSON.parse(userJson) : null;
  });

  // salesman state
  const [salesmanView, setSalesmanView] = useState('home');
  const [activeSalesman, setActiveSalesman] = useState(() => {
    const userJson = localStorage.getItem('session_user');
    const storedRole = localStorage.getItem('session_role');
    if (userJson && storedRole === 'salesman') {
      const u = JSON.parse(userJson);
      return {
        ...u,
        code: u.salesmanId || 'N/A',
        bf: u.broughtForwardDebt || 0
      };
    }
    return null;
  });

  // owner state
  const [ownerView, setOwnerView] = useState('home');

  // error message state
  const [errorMsg, setErrorMsg] = useState('');

  // pin verification state
  const [isOwnerPinVerified, setIsOwnerPinVerified] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [verifyingPin, setVerifyingPin] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('session_token');
    localStorage.removeItem('session_role');
    localStorage.removeItem('session_user');
    setRole('none');
    setSalesmanView('home');
    setActiveSalesman(null);
    setActiveOperator(null);
    setOwnerView('home');
    setErrorMsg('');
    setIsOwnerPinVerified(false);
    setPinInput('');
    setPinError('');
  };

  React.useEffect(() => {
    if (role === 'none') {
      window.handleGoogleCallback = async (response) => {
        setErrorMsg('');
        try {
          const res = await apiClient.post('/auth/google', {
            credential: response.credential
          });
          
          const { token, role: userRole, user } = res.data;
          
          localStorage.setItem('session_token', token);
          localStorage.setItem('session_role', userRole);
          localStorage.setItem('session_user', JSON.stringify(user));
          
          setRole(userRole);
          if (userRole === 'salesman') {
            setActiveSalesman({
              ...user,
              code: user.salesmanId || 'N/A',
              bf: user.broughtForwardDebt || 0
            });
          } else if (userRole === 'operator') {
            setActiveOperator(user);
          }
        } catch (err) {
          setErrorMsg(err.response?.data?.error || 'Authentication failed. Email might not be registered.');
        }
      };

      const initGoogle = () => {
        if (window.google) {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your_google_client_id_here',
            callback: window.handleGoogleCallback,
          });

          const btnDiv = document.getElementById('google-btn-container');
          if (btnDiv) {
            window.google.accounts.id.renderButton(
              btnDiv,
              { theme: 'outline', size: 'large', width: 320 }
            );
          }
        }
      };

      initGoogle();

      const interval = setInterval(() => {
        if (window.google) {
          initGoogle();
          clearInterval(interval);
        }
      }, 500);

      return () => clearInterval(interval);
    }
  }, [role]);

  if (role === 'none') {
    return (
      <div className="w-full max-w-md mx-auto p-4 min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 font-sans">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full flex flex-col gap-8 text-center border border-gray-100">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl font-extrabold mb-2 shadow-inner">
              G
            </div>
            <h1 className="text-3xl font-extrabold text-gray-800">Sign in with Google</h1>
            <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
              Quick and secure sign-in with your Google account
            </p>
          </div>
          
          <div className="flex flex-col items-center justify-center w-full min-h-[50px]">
            <div id="google-btn-container" className="w-full flex justify-center"></div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-lg border border-red-100 leading-normal">
              {errorMsg}
            </div>
          )}

          <div className="text-gray-400 text-xs mt-2">
            Manikyapriya Agencies Dashboard System
          </div>
        </div>
      </div>
    );
  }

  // Common Header for authenticated state
  const Header = () => (
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
  );

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    setVerifyingPin(true);
    setPinError('');
    try {
      await apiClient.post('/auth/verify-owner', { pin: pinInput });
      setIsOwnerPinVerified(true);
    } catch (err) {
      setPinError(err.response?.data?.error || 'Invalid PIN');
    } finally {
      setVerifyingPin(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 min-h-screen bg-gray-50 flex flex-col font-sans">
      <Toaster position="top-center" toastOptions={{ style: { background: '#333', color: '#fff' } }} />
      <Header />
      
      {role === 'salesman' ? (
        <main className="flex-1 w-full pb-4 flex flex-col gap-4">
          {salesmanView === 'home' && !activeSalesman && (
            <SalesmanSelectionList 
              onSelectSalesman={(s) => setActiveSalesman(s)} 
            />
          )}
          {salesmanView === 'home' && activeSalesman && (
            <>
              <SalesmanProfileCard 
                salesman={activeSalesman}
                onNavigateToBilling={() => setSalesmanView('billing')} 
                onNavigateToCash={() => setSalesmanView('cash')} 
                onNavigateToPrices={() => setSalesmanView('prices')}
                onBackToList={null}
              />
              <SalesmanStatementHistory salesmanId={activeSalesman._id} />
            </>
          )}
          {salesmanView === 'billing' && (
            <SalesmanBillingScreen salesman={activeSalesman} onBack={() => setSalesmanView('home')} />
          )}
          {salesmanView === 'cash' && (
            <CashPaymentSettlement salesman={activeSalesman} onBack={() => setSalesmanView('home')} />
          )}
          {salesmanView === 'prices' && (
            <SalesmanPriceList onBack={() => setSalesmanView('home')} />
          )}
        </main>
      ) : role === 'owner' ? (
        <main className="flex-1 w-full pb-4">
          {!isOwnerPinVerified ? (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mt-4 text-center">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Owner Verification</h3>
              <p className="text-sm text-slate-500 mb-6 font-medium">Please enter your PIN to access the dashboard.</p>
              <form onSubmit={handlePinSubmit} className="flex flex-col gap-4 max-w-[220px] mx-auto">
                <input 
                  type="password" 
                  value={pinInput} 
                  onChange={(e) => setPinInput(e.target.value)} 
                  placeholder="Enter PIN" 
                  className="w-full text-center tracking-widest text-2xl font-bold p-3 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  autoFocus
                />
                {pinError && <p className="text-xs text-red-500 font-bold">{pinError}</p>}
                <button 
                  type="submit" 
                  disabled={verifyingPin || !pinInput}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors shadow-xs flex items-center justify-center"
                >
                  {verifyingPin ? (
                    <svg className="w-5 h-5 animate-spin text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  ) : 'Unlock Portal'}
                </button>
              </form>
            </div>
          ) : (
            <>
              {ownerView === 'home' && (
                <OwnerDashboard onNavigate={setOwnerView} />
              )}
          {ownerView === 'verify' && (
            <VerificationDesk onBack={() => setOwnerView('home')} />
          )}
          {ownerView === 'ledger' && (
            <LedgerControlPortal onBack={() => setOwnerView('home')} />
          )}
          {ownerView === 'staff' && (
            <StaffManagementPortal onBack={() => setOwnerView('home')} />
          )}
          {ownerView === 'inventory' && (
            <InventoryControlPortal onBack={() => setOwnerView('home')} />
          )}
          {ownerView === 'brands' && (
            <BrandManagerPortal onBack={() => setOwnerView('home')} />
          )}
              {ownerView === 'billing_ops' && (
                <OperatorDashboard onBackToList={() => setOwnerView('home')} />
              )}
            </>
          )}
        </main>
      ) : role === 'operator' ? (
        <main className="flex-1 w-full pb-4">
          {!activeOperator ? (
            <OperatorSelectionList onSelectOperator={(op) => setActiveOperator(op)} />
          ) : (
            <OperatorDashboard onBackToList={null} />
          )}
        </main>
      ) : null}
    </div>
  );
}