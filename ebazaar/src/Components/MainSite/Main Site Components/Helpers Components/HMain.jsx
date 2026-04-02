import React from 'react'
import HMCards from './HMain Sections/HMCards'
import HMFilter from './HMain Sections/HMFilter'
import './HMain.scss'
const HMain = () => {
  
  return (
    <div className='hm-main-container'>
        <div className='hm-main-section'>
        <HMFilter/>
        <HMCards/>
        </div>
    </div>
  )
}

export default HMain