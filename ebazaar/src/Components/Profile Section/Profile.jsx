import React from 'react'
import { Outlet } from 'react-router'
import NavBtn from './Profile Components/NavBtn'
import ProfleCHead from './Profile Components/ProfleCHead'

const Profile = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-72 lg:w-80 flex-shrink-0 bg-white shadow-[10px_0_15px_-3px_rgb(0,0,0,0.05)] border-r border-gray-100 z-10 sticky top-0 md:h-screen">
        <NavBtn />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Profile Info */}
        <div className="bg-white/80 backdrop-blur-md sticky top-0 z-0">
          <ProfleCHead />
        </div>

        {/* Dynamic Rendered Component */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Profile