import React from 'react'
import './Section3.scss'
const Section3 = () => {
  const hs3Cards=[
    {
      title:'Vegetables',
      imageURL:'https://th.bing.com/th/id/OIP.lR4WpAVmTYj3sgvn_EgOlQHaEo?pid=ImgDet&rs=1',
    },
    {
      title:'Fruits',
      imageURL:'https://th.bing.com/th/id/OIP._DjqNJFKqHtIStd6H5nlSwHaEo?pid=ImgDet&rs=1',
    },
    {
      title:'Poltry Items',
      imageURL:'https://th.bing.com/th/id/OIP.pYNHCvVpGjQ7R-4RSOMEYAHaEn?pid=ImgDet&rs=1',
    }
  ]

  return (
    <div className='h-section3-container'>
        {hs3Cards.map((card)=>{
          return(
          <div className='hs3-card-c relative'>
            <h1 className='absolute z-2'>{card.title}</h1>
            <div style={{backgroundImage:`url(${card.imageURL})`,width:'100%',height:'100%'}} className='absolute blur-sm z-0'></div>
          </div>
          )
        })}
    </div>
  )
}

export default Section3