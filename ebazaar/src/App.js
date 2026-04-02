import './App.css';
import Main from './Components/MainSite/Main';
import Admin from './Components/Admin/Admin';
import Home from './Components/MainSite/Main Site Components/Home';
import { Route, Routes } from 'react-router';
import Auth from './Components/Authentication/Auth';
import Farm from './Components/MainSite/Main Site Components/Farm';
import Farms from './Components/MainSite/Main Site Components/Farms';
import Products from './Components/MainSite/Main Site Components/Products';
import Helpers from './Components/MainSite/Main Site Components/Helpers';
import { useEffect } from 'react';
import { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import Profile from './Components/Profile Section/Profile';
import BeHelpers from './Components/MainSite/Main Site Components/BeHelpers';
import RentEquipment from './Components/MainSite/Main Site Components/RentEquipment';
import HelpingEqp from './Components/MainSite/Main Site Components/HelpingEqp';
import { useContext } from 'react';
import { UserContext } from './Context/user.context'
import ProfileSettings from './Components/Profile Section/Profile Components/ProfileSettings';
import Dashboard from './Components/Profile Section/Profile Components/Dashboard';
import CreateFarm from './Components/Profile Section/Profile Components/CreateFarm';
import ViewProduct from './Components/MainSite/Main Site Components/ViewProduct';
import Cart from './Components/Cart/Cart';
import { loadStripe } from '@stripe/stripe-js';
import PaymentPage from './Components/payment/PaymentPage';
import OrdersPage from './Components/Profile Section/Profile Components/OrdersPage';
function App() {
  const [user, setUser] = useState(null)
  const { setCurrentUser, setUserDB, userDB } = useContext(UserContext);

  useEffect(() => {
    auth.onAuthStateChanged((userinfo) => {
      if (userinfo) {
        setUser(userinfo);
        setCurrentUser(userinfo)
      } else {
        setUser(null)
        setCurrentUser(userinfo)
      }
    })
  }, [])
  return (
    <div className="App">
      <ToastContainer position='bottom-right' />
      <Routes>

        {/*AUthentocation Section*/}
        <Route path='/auth' element={<Auth user={user} />} />

        {/*Admin Panel*/}
        <Route path='/admin' element={<Admin user={user} />} />
        <Route path='/cart' element={<Cart user={user} />}>

        </Route>


        {/*Main Section*/}
        <Route path='/' element={<Main user={user} />}>
          <Route path='/' element={<Home />} />
          <Route path='farm/:id' element={<Farm user={user} />} />
          <Route path='farms' element={<Farms />} />
          <Route path='products' element={<Products user={user} />} />
          <Route path='helpers' element={<Helpers />} />
          <Route path='be-helpers' element={<BeHelpers user={user} />} />
          <Route path='rent-my-equipment' element={<HelpingEqp />} />
          <Route path='rental-equipments' element={<RentEquipment />} />
          <Route path='view-item/:id' element={<ViewProduct user={user} />} />
        </Route>

        {/*Profile Section*/}
        <Route path='/profile' element={<Profile />}>
          <Route path='' element={<ProfileSettings />} />
          <Route path='dashboard' element={<Dashboard user={user} />} />
          <Route path='create-farm' element={<CreateFarm user={user} />} />
          <Route path='order-page' element={<OrdersPage user={user} />} />
        </Route>
        <Route path='/checkout' element={<PaymentPage />} />
      </Routes>
    </div>
  );
}

export default App;
