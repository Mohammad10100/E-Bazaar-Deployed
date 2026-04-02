import React, { useState, useContext } from 'react'
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { UserContext } from '../../../Context/user.context';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase';
import { toast } from 'react-toastify';

const NavBtn = () => {
  const { userDB } = useContext(UserContext)
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    signOut(auth).then(() => {
      toast.success("Successfully logged out");
      navigate("/");
    }).catch(() => {
      toast.error("Failed to log out");
    });
  }

  // Active state utility based on current URL
  const isActive = (path) => {
    if (path === '/profile' && location.pathname === '/profile') return true;
    if (path !== '/profile' && location.pathname.includes(path)) return true;
    return false;
  };

  const navLinks = [
    ...(userDB?.admin ? [{ name: 'Farm Dashboard', path: '/profile/dashboard', icon: <DashboardCustomizeIcon /> }] : []),
    { name: 'Profile Settings', path: '/profile', icon: <AccountCircleIcon />, exact: true },
    { name: 'Your Orders', path: '/profile/order-page', icon: <CircleNotificationsIcon /> }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white md:bg-transparent px-4 py-6 md:p-6 lg:p-8">
      <div className="mb-10 text-center md:text-left">
        <Link to={'/'} className="inline-block" onClick={() => setMobileMenuOpen(false)}>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-800 tracking-tight">EBazaar</h1>
        </Link>
        <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wider">Farmer Portal</p>
      </div>

      <nav className="flex-1 space-y-3">
        {navLinks.map((link) => {
          const active = isActive(link.path);
          return (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all duration-200 ${active ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md' : 'text-gray-600 hover:bg-green-50 hover:text-green-700'}`}
            >
              <div className={`${active ? 'text-white' : 'text-gray-400 group-hover:text-green-600'}`}>
                {link.icon}
              </div>
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 pt-8 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
        >
          <LogoutIcon />
          Logout Safely
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header Toggle */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100 sticky top-0 z-50">
        <Link to={'/'}>
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-800">EBazaar</h1>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
        >
          {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] z-40 bg-white overflow-y-auto">
          <SidebarContent />
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full">
        <SidebarContent />
      </div>
    </>
  )
}

export default NavBtn