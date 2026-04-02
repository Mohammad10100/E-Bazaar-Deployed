import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Link } from 'react-router-dom';

const Farms = () => {
  const [farms, setFarms] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'farm'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const farmsData = [];
      snapshot.forEach((doc) => {
        farmsData.push({ id: doc.id, ...doc.data() });
      });
      setFarms(farmsData);
    });
    return () => unsubscribe();
  }, []);

  const filteredFarms = farms?.filter(farm =>
    (farm.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (farm.city || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-800 tracking-tight sm:text-6xl mb-4">
            Discover Local Farms
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
            Connect directly with growers in your community. Fresh, organic, and sustainable.
          </p>
          <div className="mt-8 max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Search by farm name or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-5 pr-12 py-4 rounded-full border-0 focus:ring-4 focus:ring-green-400/50 shadow-xl bg-white/80 backdrop-blur-md text-gray-800 placeholder-gray-400 transition-all duration-300"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-4 top-4 h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {farms ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredFarms?.map((farm) => (
              <div key={farm.id} className="group relative bg-white/40 backdrop-blur-lg border border-white/60 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 transform hover:-translate-y-2 flex flex-col">
                <div
                  className="h-48 w-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  style={{ backgroundImage: `url(${farm.bannerURL || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800'})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                </div>
                <div className="relative p-6 flex-grow flex flex-col">
                  <div className="absolute -top-12 right-6 bg-white p-2 rounded-2xl shadow-lg">
                    <div className="h-16 w-16 bg-green-100 rounded-xl flex items-center justify-center text-green-600 font-bold text-2xl">
                      {farm.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">{farm.name}</h3>
                  <p className="text-sm font-medium text-green-600 mb-4 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                    {farm.city}, {farm.state}
                  </p>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-grow">
                    {farm.description || "A wonderful local farm offering fresh produce and sustainable agriculture."}
                  </p>
                  <div className="mt-auto">
                    <Link to={`/farm/${farm.id}`} className="block w-full text-center py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all duration-200">
                      Visit Farm
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Farms;