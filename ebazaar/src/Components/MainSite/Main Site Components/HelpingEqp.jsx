import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../../firebase';
import { toast } from 'react-toastify';

const HelpingEqp = () => {
  const [form, setForm] = useState({ name: '', price: '', description: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'equipment'), {
        ...form,
        createdAt: new Date()
      });
      toast.success("Equipment successfully listed for rent!");
      setForm({ name: '', price: '', description: '' });
    } catch (error) {
      toast.error("Failed to list equipment: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-10 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-2">List Your Equipment</h2>
          <p className="text-green-100">Help the farming community and earn extra income by renting out your idle equipment.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 sm:p-12 space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Equipment Name</label>
            <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all bg-gray-50" placeholder="e.g. John Deere Tractor 5000" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Rental Price per Day (Rs.)</label>
            <input type="number" required value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all bg-gray-50" placeholder="e.g. 1500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description & Condition</label>
            <textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows="4" className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all bg-gray-50" placeholder="Detailed description of the tool..." />
          </div>
          <button type="submit" disabled={loading} className="w-full py-4 text-white font-bold text-lg rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg transition-all disabled:opacity-50 mt-4">
            {loading ? 'Publishing...' : 'List Equipment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HelpingEqp;