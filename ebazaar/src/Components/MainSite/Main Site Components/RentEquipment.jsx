import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../../firebase';

const RentEquipment = () => {
  const [equipment, setEquipment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'equipment'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const equipData = [];
      snapshot.forEach((doc) => {
        equipData.push({ id: doc.id, ...doc.data() });
      });
      setEquipment(equipData);
    });
    return () => unsubscribe();
  }, []);

  const filteredEquipment = equipment?.filter(e =>
    (e.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-24 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-800 tracking-tight sm:text-6xl mb-4">
            Rent Heavy Duty Equipment
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
            Find the right tools for your farm. Rent tractors, harvesters, and more from your local community.
          </p>
          <div className="mt-8 max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Search for tractors, tillers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-6 pr-12 py-4 rounded-full border-0 focus:ring-4 focus:ring-green-400/50 shadow-xl bg-white/80 backdrop-blur-md text-gray-800 placeholder-gray-400 transition-all duration-300"
            />
          </div>
        </div>

        {equipment ? (
          filteredEquipment?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredEquipment.map((item) => (
                <div key={item.id} className="group relative bg-white/40 backdrop-blur-lg border border-white/60 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col">
                  <div
                    className="h-56 w-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    style={{ backgroundImage: `url(${item.imageURL || 'https://images.unsplash.com/photo-1592982537447-6f2334cb42be?auto=format&fit=crop&q=80&w=800'})` }}
                  >
                  </div>
                  <div className="p-6 flex-grow flex flex-col bg-white/80">
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">{item.name || 'Heavy Equipment'}</h3>
                    <p className="text-green-600 text-xl font-bold mb-4">Rs. {item.price || '500'} <span className="text-sm text-gray-500">/ day</span></p>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-grow">
                      {item.description || "Reliable, well-maintained equipment ready for your toughest farming jobs."}
                    </p>
                    <button className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-md transition-all duration-200">
                      Request Rental
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/50 backdrop-blur-md rounded-3xl border border-white">
              <p className="text-xl text-gray-500 font-medium">No equipment found matching your search.</p>
            </div>
          )
        ) : (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RentEquipment;