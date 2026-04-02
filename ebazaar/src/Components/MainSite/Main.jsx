import React from 'react'
import { Outlet } from 'react-router'
import Navbar from './Header Component/Navbar'
import Footer from './Main Site Components/Footer'

const Main = ({user}) => {
  return (
    <div>
        <Navbar user={user}/>
        <Outlet/>
        <Footer/>
    </div>
  )
}

export default Main