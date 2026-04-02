import React, { useState, useEffect, useContext } from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { UserContext } from '../../../Context/user.context';

const ProfleCHead = () => {
  const [time, setTime] = useState(new Date());
  const { userDB } = useContext(UserContext)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours();
  let greeting;
  if (hours >= 5 && hours < 12) {
    greeting = 'Good Morning';
  } else if (hours >= 12 && hours < 18) {
    greeting = 'Good Afternoon';
  } else {
    greeting = 'Good Evening';
  }

  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = time.toLocaleDateString(undefined, dateOptions);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-gray-100 bg-white">
      <div className="mb-4 sm:mb-0">
        <h2 className="text-2xl font-extrabold text-gray-900">{greeting}, {userDB?.name?.split(' ')[0] || 'User'}!</h2>
        <p className="text-sm font-medium text-gray-500 mt-1">{formattedDate}</p>
      </div>

      <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-full border border-gray-100">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
          <AccountCircleIcon />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 leading-tight">{userDB?.name || 'Loading...'}</p>
          <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">{userDB?.admin ? 'Farm Admin' : 'Customer'}</p>
        </div>
      </div>
    </div>
  )
}

export default ProfleCHead