import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Link } from 'react-router-dom';

const Helpers = () => {
  const [helpers, setHelpers] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'helpers'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const helpersData = [];
      snapshot.forEach((doc) => {
        helpersData.push({ id: doc.id, ...doc.data() });
      });
      setHelpers(helpersData);
    });
    return () => unsubscribe();
  }, []);

  const filteredHelpers = helpers?.filter(h =>
    (h.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (h.city || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (person) => {
    setSelectedPerson(person);
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
    setSelectedPerson(null);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-24 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-800 tracking-tight sm:text-6xl mb-4">
            Farm Laborers & Helpers
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
            Hire skilled agricultural workers for your farm. Browse verified profiles and get the help you need today.
          </p>
          <div className="mt-8 max-w-xl mx-auto flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search by name or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-6 pr-12 py-4 rounded-full border-0 focus:ring-4 focus:ring-green-400/50 shadow-xl bg-white/80 backdrop-blur-md text-gray-800 placeholder-gray-400 transition-all duration-300"
              />
            </div>
            <Link to="/be-helpers" className="px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg transition-shadow whitespace-nowrap">
              Become a Helper
            </Link>
          </div>
        </div>

        {helpers ? (
          filteredHelpers?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredHelpers.map((helper) => (
                <div key={helper.id} className="group bg-white/60 backdrop-blur-xl border border-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col">
                  <div className="p-6 text-center border-b border-gray-100 relative">
                    {helper.verified && (
                      <div className="absolute top-4 right-4 bg-green-100 text-green-700 p-1 rounded-full" title="Verified Helper">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      </div>
                    )}
                    <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full mb-4 overflow-hidden border-4 border-white shadow-sm">
                      <img src={helper.profileImg || 'https://i.stack.imgur.com/l60Hf.png'} alt={helper.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{helper.name}</h3>
                    <p className="text-sm text-gray-500 font-medium">{helper.city}, {helper.state || 'Local'}</p>
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex justify-between items-center mb-4 text-sm">
                      <span className="text-gray-500">Hourly Rate</span>
                      <span className="font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg">Rs. {helper.wages}/hr</span>
                    </div>
                    <div className="flex justify-between items-center mb-4 text-sm">
                      <span className="text-gray-500">Experience/Age</span>
                      <span className="font-semibold text-gray-800">{helper.age} yrs</span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-3 italic mb-6 flex-grow border-l-2 border-green-200 pl-3">
                      "{helper.about || "Hardworking individual ready to assist with daily farm tasks."}"
                    </p>
                    <button className="w-full py-3 rounded-xl font-bold text-green-700 bg-green-100 hover:bg-green-200 transition-colors mt-auto" onClick={() => {
                      openModal(helper); setSelectedPerson(helper);
                    }}>
                      Contact / Hire
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/50 backdrop-blur-md rounded-3xl border border-white">
              <p className="text-xl text-gray-500 font-medium">No helpers found matching your search.</p>
            </div>
          )
        ) : (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
          </div>
        )}
      </div>

      {isOpen && selectedPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">

          <div className="bg-white p-6 rounded-lg w-80 relative">
            {/* Content */}
            <h2 className="text-xl font-bold mb-2">
              Contact {selectedPerson.name}
            </h2>

            {/* <p>Email: {selectedPerson.name}</p> */}

            <p>Phone: {selectedPerson.phoneNumber}</p>

            {/* Optional CTA */}
            <button className="w-full py-3 rounded-xl font-bold text-green-700 bg-green-100 hover:bg-green-200 transition-colors mt-auto" onClick={closeModal}>
              Close
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default Helpers;