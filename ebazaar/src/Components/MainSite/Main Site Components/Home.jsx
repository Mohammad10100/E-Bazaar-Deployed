import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen font-sans bg-[#F9FAFB] overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=2000')" }}
        ></div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/40 to-green-900/80"></div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 text-sm rounded-full text-green-100 font-medium tracking-widest uppercase mb-8 shadow-xl">
            🌾 Welcome to the Future of Agriculture
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 drop-shadow-2xl">
            Empowering Farmers.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-500">
              Connecting Communities.
            </span>
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-10 drop-shadow-md font-light leading-relaxed">
            EBazaar is the premier marketplace for buying organic produce directly from growers, renting heavy-duty equipment, and hiring skilled farm laborers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/products" className="px-8 py-4 rounded-full font-bold text-green-900 bg-green-400 hover:bg-green-300 hover:shadow-[0_0_40px_rgba(74,222,128,0.5)] transition-all duration-300 transform hover:-translate-y-1 text-lg">
              Shop Fresh Produce
            </Link>
            <Link to="/farms" className="px-8 py-4 rounded-full font-bold text-white bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-lg">
              Explore Local Farms
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 z-20 animate-bounce">
          <svg className="w-8 h-8 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
              An ecosystem built for growth.
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Everything you need to run your farm or source the best local ingredients, all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="group bg-green-50 rounded-3xl p-8 hover:bg-green-600 transition-colors duration-500 cursor-default shadow-lg hover:shadow-2xl">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                <span className="text-3xl">🥬</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-white transition-colors duration-500 mb-4">
                Organic Marketplace
              </h3>
              <p className="text-gray-600 group-hover:text-green-50 transition-colors duration-500 leading-relaxed">
                Buy and sell freshly harvested crops without the middlemen. Get better prices for your hard work and enjoy farm-to-table freshness.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-amber-50 rounded-3xl p-8 hover:bg-amber-600 transition-colors duration-500 cursor-default shadow-lg hover:shadow-2xl">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                <span className="text-3xl">🚜</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-white transition-colors duration-500 mb-4">
                Equipment Rentals
              </h3>
              <p className="text-gray-600 group-hover:text-amber-50 transition-colors duration-500 leading-relaxed">
                Need a harvester for two days? Rent heavy machinery from your neighbors or list your idle equipment to earn extra income.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-blue-50 rounded-3xl p-8 hover:bg-blue-600 transition-colors duration-500 cursor-default shadow-lg hover:shadow-2xl">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                <span className="text-3xl">👨‍🌾</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-white transition-colors duration-500 mb-4">
                Skilled Labor
              </h3>
              <p className="text-gray-600 group-hover:text-blue-50 transition-colors duration-500 leading-relaxed">
                Connect with verified farm hands and laborers. Whether for harvest season or daily chores, find the right help instantly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;