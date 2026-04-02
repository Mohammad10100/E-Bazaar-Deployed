import React from 'react'
import { useState } from 'react'

const HMFilter = () => {
    const [filterValue,setFilterValue]=useState(100)
    const [age,setAge] = useState(100)
    const handleRange=(e)=>{
        setFilterValue(e.target.value)
    }
    const handleAge=(e)=>{
        setAge(e.target.value)
    }
  return (
    <div className='hm-filter-container'>
        <h1>Filter</h1>
        <input type="range" min="50" max="100" onChange={handleRange} value={filterValue}/>
        <p>Max Wage: {filterValue}/hr</p>
        <input type="range" min="18" max="100" onChange={handleAge} value={age}/>
        <p>Max Age: {age}</p>
        <input type="text" placeholder='Search City' className='city-search' />
        <div>
        <input type="checkbox" id='checkbox-1' style={{margin:'0',width:'30px'}}/>
        <label htmlFor="checkbox-1">Verified Accounts</label>
        </div>
        <button style={{width:'100%',padding:'10px 20px',marginTop:'20px',color:'white'}} className='bg-green-600 filter-search-btn'>Search</button>
    </div>
  )
}

export default HMFilter