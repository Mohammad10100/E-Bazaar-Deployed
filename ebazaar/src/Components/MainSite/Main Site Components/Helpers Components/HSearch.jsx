import React from 'react'
import './HSearch.scss'
const HSearch = () => {
  return (
    <div className='hsearch-container'>
        <div className='search-bar-container'>
            <h1>Browse Helpers</h1>
            <input type="search" placeholder='Enter helper name' />
        </div>
    </div>
  )
}

export default HSearch