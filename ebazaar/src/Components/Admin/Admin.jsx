import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../firebase';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import InventoryIcon from '@mui/icons-material/Inventory';

const Admin = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [farmsCount, setFarmsCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);

  const [recentFarms, setRecentFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to users collection
    const unsubUsers = onSnapshot(query(collection(db, 'users')), (snapshot) => {
      setUsersCount(snapshot.size);
    });

    // Listen to farms collection
    const unsubFarms = onSnapshot(query(collection(db, 'farm')), (snapshot) => {
      setFarmsCount(snapshot.size);
      const farms = [];
      snapshot.forEach(doc => farms.push({ id: doc.id, ...doc.data() }));
      setRecentFarms(farms.slice(0, 5)); // Just show a few recent ones
    });

    // Listen to products collection
    const unsubProducts = onSnapshot(query(collection(db, 'product')), (snapshot) => {
      setProductsCount(snapshot.size);
      setLoading(false);
    });

    return () => {
      unsubUsers();
      unsubFarms();
      unsubProducts();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans pb-12 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              <DashboardIcon fontSize="large" className="text-green-600" />
              Platform Overview
            </h1>
            <p className="mt-2 text-lg text-gray-500">Welcome to the central command for EBazaar.</p>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Card 1 */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 bg-green-100 w-24 h-24 rounded-full opacity-50"></div>
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-green-50 rounded-2xl text-green-600 shadow-sm border border-green-100">
                <PeopleIcon fontSize="large" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Users</p>
                <h3 className="text-4xl font-bold text-gray-900 mt-1">{usersCount}</h3>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 bg-emerald-100 w-24 h-24 rounded-full opacity-50"></div>
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 shadow-sm border border-emerald-100">
                <AgricultureIcon fontSize="large" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Registered Farms</p>
                <h3 className="text-4xl font-bold text-gray-900 mt-1">{farmsCount}</h3>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 bg-teal-100 w-24 h-24 rounded-full opacity-50"></div>
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-teal-50 rounded-2xl text-teal-600 shadow-sm border border-teal-100">
                <InventoryIcon fontSize="large" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Active Products</p>
                <h3 className="text-4xl font-bold text-gray-900 mt-1">{productsCount}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Section (Tables / Activity) */}
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Recently Registered Farms</h2>
            <button className="text-sm font-bold text-green-600 hover:text-green-800 bg-green-50 px-4 py-2 rounded-lg transition-colors">
              View All
            </button>
          </div>

          {recentFarms.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-100">
                    <th className="py-4 font-semibold text-gray-400 uppercase tracking-wider text-sm">Farm Name</th>
                    <th className="py-4 font-semibold text-gray-400 uppercase tracking-wider text-sm">Location</th>
                    <th className="py-4 font-semibold text-gray-400 uppercase tracking-wider text-sm">Email</th>
                    <th className="py-4 font-semibold text-gray-400 uppercase tracking-wider text-sm">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentFarms.map((farm, index) => (
                    <tr key={farm.id || index} className="hover:bg-gray-50 transition-colors">
                      <td className="py-5 flex items-center font-bold text-gray-900">
                        <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mr-4 text-sm">
                          {farm.name ? farm.name.charAt(0).toUpperCase() : 'F'}
                        </div>
                        {farm.name || 'Unnamed Farm'}
                      </td>
                      <td className="py-5 text-gray-600 font-medium">{farm.city}, {farm.state}</td>
                      <td className="py-5 text-gray-600">{farm.email || 'N/A'}</td>
                      <td className="py-5">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase tracking-wide">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
              <AgricultureIcon className="text-gray-300 text-5xl mb-2" />
              <p className="text-gray-500 font-medium">No farms registered yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;