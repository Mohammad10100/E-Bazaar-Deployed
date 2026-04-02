import React from 'react'
import './HMCard.scss'
import StarIcon from '@mui/icons-material/Star';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
const HMCard = ({name,wage,location,age,verified,profileImg,key}) => {
  return ( 
   
    <div className='hpc-container' key={key}>
      <div className='hpc-1'>
        <img src={profileImg} alt="" />
      </div>
      <div className='hpc-2'>
        <h1>{name}</h1>
      </div>
    </div>
  )
}

export default HMCard