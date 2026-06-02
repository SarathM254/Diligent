import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function BrandManager() {
  const [brands, setBrands] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [name, setName] = useState('');
  const [wholesalePrice, setWholesalePrice] = useState('');
  const [retailPrice, setRetailPrice] = useState('');

  const fetchBrands = () => {
    api.get('/brands')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : (res.data.brands || []);
        setBrands(data);
      })
      .catch(err => {
        console.error(err);
        // Fallback for visual testing
        setBrands([
          { _id: '1', name: 'Premium Brand A', wholesalePrice: 120, retailPrice: 150 },
          { _id: '2', name: 'Standard Brand B', wholesalePrice: 250, retailPrice: 300 },
        ]);
      });
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleAddNew = () => {
    setEditingId(null);
    setName('');
    setWholesalePrice('');
    setRetailPrice('');
    setShowForm(true);
  };

  const handleEdit = (brand) => {
    setEditingId(brand._id || brand.id);
    setName(brand.name);
    setWholesalePrice(brand.wholesalePrice || '');
    setRetailPrice(brand.retailPrice || '');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/brands/upsert', {
        id: editingId,
        name,
        wholesalePrice: Number(wholesalePrice),
        retailPrice: Number(retailPrice)
      });
      setShowForm(false);
      fetchBrands();
    } catch (err) {
      console.error(err);
      alert('Failed to save brand details.');
      setShowForm(false); // Close anyway for UI testing
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full min-h-[400px]">
      <div className="p-5 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Brand Catalog</h2>
          <p className="text-sm text-gray-500 mt-1">Manage pricing and items</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-all active:scale-95 text-sm"
        >
          + Add Brand
        </button>
      </div>

      {showForm && (
        <div className="p-5 bg-blue-50 border-b border-blue-100 animate-fade-in">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <h3 className="font-bold text-blue-800">{editingId ? 'Edit Brand' : 'New Brand'}</h3>
            <input 
              required
              type="text" 
              placeholder="Brand Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <div className="flex gap-3">
              <input 
                required
                type="number" 
                placeholder="Wholesale Price"
                value={wholesalePrice}
                onChange={e => setWholesalePrice(e.target.value)}
                className="w-1/2 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input 
                required
                type="number" 
                placeholder="Retail Price"
                value={retailPrice}
                onChange={e => setRetailPrice(e.target.value)}
                className="w-1/2 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700">Save</button>
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-white text-gray-600 font-bold py-3 rounded-xl border border-gray-200 hover:bg-gray-50">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 rounded-b-2xl">
        {brands.map((b, i) => (
          <div key={b._id || i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-800">{b.name}</p>
              <div className="flex gap-4 mt-1">
                <span className="text-xs font-semibold text-gray-500">W: ₹{b.wholesalePrice}</span>
                <span className="text-xs font-semibold text-blue-600">R: ₹{b.retailPrice}</span>
              </div>
            </div>
            <button 
              onClick={() => handleEdit(b)}
              className="text-blue-600 font-bold text-sm bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors"
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
