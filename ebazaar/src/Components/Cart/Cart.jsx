import React, { useState } from 'react'
import './Cart.scss'
import CartCard from './CartCard'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { db } from '../../firebase'
import { addDoc, getDoc, updateDoc } from 'firebase/firestore'
import { deleteDoc, doc, getDocs, onSnapshot, setDoc } from 'firebase/firestore'
import { collection } from 'firebase/firestore'
import { async } from '@firebase/util'
import StripeContainer from '../payment/StripeContainer'
import { Link } from 'react-router-dom'

const Cart = ({user}) => {
  const [success,setSuccess]=useState(false);
    const [item,setItem] = useState([])
    const [update,setUpdate] = useState(1)
    const [checkOut,setCheckOut] = useState(false)
    
    var totalPurchase = item.reduce((acc, itm) => acc + (itm.price * itm.quantity), 0);
    var tax = (totalPurchase * 8) / 100;
    const insertInOrder=async()=>{
      item.forEach(async(product)=>{
        const colRef = collection(db,'orders')
        delete product.id
        addDoc(colRef,{
          ...product,
          completed:false,
        })
        var farm;
        const farmRef = doc(db,'farm',product.farm)
        const docSnap = await getDoc(farmRef);
        farm = docSnap.data();
        var earn = farm.earning+(product.price)*product.quantity
        await updateDoc(farmRef,{
          earning:earn
        })
      })
    }

    const deleteCollection=()=>{
      item.forEach((product)=>{
        const docRef = doc(db,"users",user.uid,"cart",product.id)
        deleteDoc(docRef);
      })
    }
     

    useEffect(()=>{
      if(success){
        deleteCollection();
        insertInOrder();
      }
    },[success])
    
    const handleCheckOut=()=>{
      if(totalPurchase!=0){
        setCheckOut(true)
      }else{
        toast.error("Cart is Empty!")
      }
    }

    const getItems = () => {
      const reff = collection(db, 'users', user.uid, 'cart');
      onSnapshot(reff, (docSnap) => {
        var pro = [];
        docSnap.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          pro.push({ id: doc.id, ...doc.data() });
        });
        setItem(pro);
      });
    };

    useEffect(()=>{
        getItems()
      },[user])

  return (
    <>
       {!checkOut ? (
        <>
        <div className='cart'>
         <div className='div-1'>
            <div className='membership-banner'>
                <h1>Get premium discounts for premium membership!</h1>
                <p>Become a member and get your favourite products at exclusive discount prices from your favourite farms</p>
            </div>
            <div style={{width:'80%'}}><h1 style={{fontSize:'30px'}} className='cart-text'>Cart ({item.length})</h1></div>
            {item.length>0 ? (<>{item.map((itm)=>{
                console.log(itm)
                return(
                    <>
                    <CartCard title={itm?.name} price={itm?.price} url={itm?.productURL} farm={itm?.farm} quantity={itm?.quantity} unit={itm?.unit} id={itm?.id} update={setUpdate}/>
                    </>
                )
            })}</>):(<>
            <h1 className='empty-cart-message'>Your cart is empty</h1>
            <Link to={'/products'}>
            <div className='ctn-btn'>Continue Shopping</div>
            </Link>
            </>)}
        </div>
        <div className='div-2'>
           <div className='checkout-section'>
            <div style={{width:'100%',display:'flex',justifyContent:'space-between',padding:'0 1.2rem',alignItems:'flex-end'}}><h1>Purchased cost:</h1> <span >{totalPurchase}</span></div>
            <div style={{width:'100%',display:'flex',justifyContent:'space-between',padding:'0 1.2rem',alignItems:'flex-end'}}><h1>Total Tax:</h1> <span >{tax}</span></div>
            <hr style={{backgroundColor:'white',border:'solid 1px white',width:'90%',margin:'20px 0px'}}/>
            <div style={{width:'100%',display:'flex',justifyContent:'space-between',padding:'0 1.2rem',alignItems:'flex-end'}}><h1>TOTAL PAYMENT:</h1> <span style={{fontSize:'25px'}}>{totalPurchase+tax}rs</span></div>
            <button className='checkout-btn' onClick={handleCheckOut}>Checkout</button>
           </div>
        </div>
        </div></>
       ):(
        <div className='PaymentPage'>
        <h1>Fill your payment details</h1>
        <StripeContainer success={success} setSuccess={setSuccess} amount={Math.round((totalPurchase + tax) * 100)}/>
    </div>
       )}
       </>
  )
}

export default Cart