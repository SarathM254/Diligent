import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function SalesmanProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/salesmen')
      .then(res => {
        if (res.data && res.data.length > 0) {
          setProfile(res.data[0]);
        }
      })
      .catch(err => console.error('Error fetching salesmen:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading profile...</div>;
  if (!profile) return <div className="p-8 text-center text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100 mb-4">No salesman profile found.</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl font-bold shadow-inner">
          {profile.name?.charAt(0) || 'S'}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">{profile.name || 'Salesman'}</h2>
          <p className="text-gray-500 text-sm font-medium">{profile.email || 'No email provided'}</p>
        </div>
      </div>
      <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 flex justify-between items-center shadow-inner">
        <span className="text-gray-600 font-bold uppercase tracking-wider text-xs">Brought Forward (BF)</span>
        <span className={`text-2xl font-extrabold ${profile.bfDebt > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
          ₹{profile.bfDebt || 0}
        </span>
      </div>
    </div>
  );
}
