import React, { useState } from 'react'
import { useEffect } from 'react'
import './Cart.scss'
import { db } from '../../firebase'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { setDoc } from 'firebase/firestore'
import { useContext } from 'react'
import { UserContext } from '../../Context/user.context'
import { async } from '@firebase/util'
const CartCard = ({title,price,quantity,farm,url,unit,id,update}) => {
    const {currentUser} = useContext(UserContext);
    const [num,setNum]=useState(1)

    useEffect(()=>{
        setNum(quantity)
    },[quantity])
    const handleDelete=async()=>{
        const docRef=doc(db,'users',currentUser.uid,'cart',id)
        await deleteDoc(docRef)
    }
    const handleDec=async()=>{
        if(quantity-1>0){
            var num=quantity-1
                    await updateDoc(doc(db,'users',currentUser.uid,'cart',id),{
                        quantity:num
        })
        }
      }
    
      const handleInc=async()=>{
        var num = quantity+1
        await updateDoc(doc(db,'users',currentUser.uid,'cart',id),{
            quantity:num
          })
      }

  return (
    <div className='item-card'>
            <div className='item-image'>
                <div className='img' style={{backgroundImage:`url(${url})`}}>

                </div>
            </div>
            <div className='item-details' >
                <div>
                <h1>{title}</h1>
                <p>Sold by: Yashraj ka khet</p>
                <p>Price: {price}rs/{unit}</p>
                <div className='qtn-btn'>
                    <button onClick={handleDec}>-</button>
                    <p>{quantity}</p>
                    <button onClick={handleInc}>+</button>
                </div>
                </div>
                <div>
                    <h1 style={{fontSize:"15px"} } className='remove-item' onClick={handleDelete}>Remove item</h1>   
                </div>
            </div>
            </div>
  )
}

export default CartCard