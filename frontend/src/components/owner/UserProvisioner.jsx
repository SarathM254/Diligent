import { useState } from 'react';
import api from '../../utils/api';

export default function UserProvisioner() {
  const [role, setRole] = useState('salesman');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [salesmanId, setSalesmanId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const payload = { name, email, role };
      if (role === 'salesman') {
        payload.salesmanId = salesmanId;
      }
      await api.post('/users/register', payload);
      setMessage({ text: 'User successfully provisioned!', type: 'success' });
      setName('');
      setEmail('');
      setSalesmanId('');
    } catch (err) {
      console.error(err);
      setMessage({ text: err.response?.data?.message || 'Failed to provision user', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-2">Staff Provisioning</h2>
      <p className="text-sm text-gray-500 mb-6">Create access for your Salesmen and Operators.</p>
      
      {message.text && (
        <div className={`p-4 rounded-xl mb-4 text-sm font-semibold ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Account Role</label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="salesman">Salesman</option>
            <option value="operator">Operator</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input 
            required
            type="text" 
            placeholder="e.g. Ramesh Singh"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input 
            required
            type="email" 
            placeholder="e.g. ramesh@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {role === 'salesman' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Salesman ID Code</label>
            <input 
              required
              type="text" 
              placeholder="e.g. SM-101"
              value={salesmanId}
              onChange={(e) => setSalesmanId(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-sm disabled:opacity-70"
        >
          {loading ? 'Provisioning...' : 'Provision Account'}
        </button>
      </form>
    </div>
  );
}
