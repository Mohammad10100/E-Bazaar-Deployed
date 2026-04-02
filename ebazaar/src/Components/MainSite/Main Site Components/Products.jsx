import { collection, getDocs, orderBy, query, onSnapshot, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../../../firebase'
import { Link } from 'react-router-dom'

const Products = ({ user }) => {
  const [products, setProducts] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const getProducts = () => {
    const q = query(collection(db, 'product'));
    onSnapshot(q, (docSnap) => {
      var pro = [];
      docSnap.forEach((doc) => {
        pro.push({ id: doc.id, ...doc.data() });
      });
      setProducts(pro);
    });
  };

  useEffect(() => {
    getProducts();
  }, []);

  const filteredProducts = products?.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-24">
      {/* Hero Header */}
      <div className="relative bg-green-900 py-24 sm:py-32 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-green-900/90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-6 drop-shadow-lg">
            Fresh From The Soil
          </h1>
          <p className="mt-4 text-xl text-green-100 max-w-2xl mx-auto drop-shadow-md">
            Direct from farmers to your table. Explore premium, organic, and sustainably grown produce.
          </p>

          {/* Search Bar */}
          <div className="mt-10 max-w-2xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input
              type="text"
              placeholder="Search for tomatoes, wheat, apples..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-12 pr-4 py-5 rounded-2xl border-0 ring-4 ring-transparent focus:ring-green-400 bg-white shadow-2xl text-lg text-gray-900 placeholder-gray-400 transition-all duration-300 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-[-40px] relative z-10">
        {products ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts?.map((item) => (
              <div key={item.id} className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 flex flex-col">
                <div className="relative h-56 w-full overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    style={{ backgroundImage: `url(${item?.productURL || 'https://images.unsplash.com/photo-1596434458316-2dafc819fbc4?auto=format&fit=crop&q=80&w=800'})` }}
                  ></div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-green-700 shadow-sm">
                    Rs. {item.price}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-6 font-medium flex-grow">Grown by Farm ID: {item.farm?.substring(0, 8) || 'Local Farm'}</p>

                  <div className="flex gap-3 mt-auto">
                    <Link to={`/view-item/${item.id}`} className="flex-1 text-center py-2.5 px-4 rounded-xl border-2 border-green-500 text-green-600 font-semibold hover:bg-green-50 transition-colors duration-200">
                      Details
                    </Link>
                    {/* <button id={item.id} className="flex-1 py-2.5 px-4 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                      Buy
                    </button> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center h-64 mt-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mb-4"></div>
            <p className="text-green-800 font-medium text-lg">Harvesting fresh products...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Products