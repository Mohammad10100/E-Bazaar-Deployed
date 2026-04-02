
import { async } from '@firebase/util';
import { addDoc, collection, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, setDoc, where } from 'firebase/firestore';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router'
import { db } from '../../../firebase';
import './Farm.scss' 
import { Link } from 'react-router-dom'
import CommentSLider from './Farm Components/CommentSLider';
import StripeContainer from '../../payment/StripeContainer';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { UserContext } from '../../../Context/user.context';


const Farm = ({user}) => {
  const [payment,setPayment]=useState(false);
  const [farm,setFarm]=useState([])
  const [popularProduct,setPopularProduct]=useState([]);
  const [success,setSuccess]=useState(false);
  const [join,setJoin] = useState(false)
  const [memDetails,setMemDetails]=useState({})
  const {currentUser,userDB}=useContext(UserContext)
  const [farmProduct,setProducts]=useState([]);
  var checkboxes = document.querySelectorAll('input[type=checkbox]');
  const [alreadyMember,setAlreadyMember]=useState(false);
  const [member,setMember]=useState([])
  const [userMemberData,setUserMemberData]=useState([])
  const {id} = useParams();
  const {setAFK}= useContext(UserContext)
  const navigate=useNavigate();
// loop through each checkbox
useEffect(() => {
  onSnapshot(collection(db, 'farm', id, 'members'), (snapshot) => {
    const memberData = snapshot.docs.map((doc) => doc.data());
    const alreadyMemberIndex = memberData.findIndex((m) => m.userID === user.uid);
    setAlreadyMember(alreadyMemberIndex !== -1);
    setUserMemberData(memberData[alreadyMemberIndex] || {});
  });
}, [db, id, user.uid]);

const getMemberData=async()=>{
  const docRef= doc(db,'farm',id,'members',user.uid)
  const docSnap = await getDoc(docRef);
  setUserMemberData(docSnap.data())

}

useEffect(() => {
  const index = member.findIndex((m) => m.userID === user.uid);
  setAlreadyMember(index !== -1);
  getMemberData();
  console.log("hello");
  console.log(index !== -1);
}, [member]);

const handleMemberShip = (e) => {
  setJoin(true);
  if (e.target.checked) {
    if (e.target.value === '1') {
      setMemDetails({
        plan: '6months',
        price: '1000',
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
        userID:currentUser.uid
      });
    } else if (e.target.value === '2') {
      setMemDetails({
        plan: '3months',
        price: '650',
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
        userID:user.uid,
        userName:user.displayName
      });
    }
  }
};

const getFarmProduct=()=>{
  const q = query(collection(db, 'product'), where('farm','==',id));
    onSnapshot(q, (docSnap) => {
      var pro = [];
      docSnap.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        pro.push({ id: doc.id, ...doc.data() });
      });
      setProducts(pro);
    });
}

useEffect(()=>{
  getFarmProduct();
},[])

const addMember = async () => {
  const memberRef = doc(db,'farm',id,"members",user.uid);
  await setDoc(memberRef, { ...memDetails,farm:id });
  toast.success("redirecting to the farm hold")
  setTimeout(()=>{
    window.location.reload()
  },3000)
  
};


useEffect(() => {
  if (success) {
    console.log(memDetails)
    addMember();
  }

}, [success]);

const doPayment=()=>{
  if(join){
    setPayment(true);
  }else{
    toast.error('select a plan')
  }
}

for (var i = 0; i < checkboxes.length; i++) {
  // listen for click events on the checkbox
  checkboxes[i].addEventListener('click', function() {
    // uncheck all the other checkboxes
    for (var j = 0; j < checkboxes.length; j++) {
      if (checkboxes[j] != this) {
        checkboxes[j].checked = false;
      }
    }
  });
}
  const getPopularProduct=async()=>{
    const q = query(
      collection(db, 'product'),
      where('farm', '==', id),
      orderBy('likedBy','desc'),
      limit(1)
    );
  
    onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))[0];
      setPopularProduct(data);
    });
    console.log(popularProduct)
  }

  const getFarm=()=>{
    const DocRef = doc(db,'farm',id)
    onSnapshot(DocRef,(doc)=>{
      setFarm(doc.data());
    })
  }

  
  useEffect(()=>{
    getFarm()
    getPopularProduct();
  },[id]) 
  return (
    <>
    {payment ? (
    <div className='payment-page'>
      <h1>Fill your payment details</h1>
      <StripeContainer setSuccess={setSuccess} success={success}/>
    </div>):(
      <div className='Farm-container'>
      <div className='div-1'>
        <div className='div11'>
        <h1 className='title-farm'>{farm.name}</h1>
        <p>{farm.description}</p>
        <ul>
          <Link to={`/view-item/${popularProduct.id}`}>
          <li>POPULAR PRODUCT:<span style={{marginLeft:'10px'}}>{popularProduct.name}</span> </li>
          </Link>  
          <li>LIKED BY: <span style={{marginLeft:'10px'}}>{farm.likedBy ? (<>{farm.likedBy} people</>):(<>Be the first to like</>)}</span></li>
        </ul>
        <div className='testimonials' >

        </div>
        </div>
        <div className='div12'>
          <div className='membership-card'>
            <div className='head' style={{backgroundImage:`url(${farm.bannerURL})`}}>
            </div>
            <div className='body'>
              <p>Membership for {farm.name}</p>
              {!alreadyMember ? (<>
                <p className='input-mem'><input type='checkbox' value='1' onClick={handleMemberShip}></input> 6 months membership - 1000rs</p>
                <p className='input-mem'><input type='checkbox' value='2' onClick={handleMemberShip}></input> 3 months membership - 650rs</p>
              <div className='membership-join'>
                
                <button onClick={doPayment}>Join Membership</button>
              </div>
              </>): (<>
              <p style={{backgroundColor:'green'}}>Already Joined as a member</p>
              <p className='input-mem plan-detail' >PLAN: {userMemberData.plan}</p>
              </>)}
            </div>
          </div>
        </div>
      </div>
      <div className='div-2'>
        {farmProduct.map((item)=>{
          return(
            <div className='product-card'>
              <div className='card'>
                <div className='card-div-1' style={{backgroundImage:`url(${item?.productURL})`}}>

                </div>
                <div className='card-div-2'>
                <div style={{margin:'10px 10px'}}>
                <p className='price'>Rs.{item?.price}</p>
                  <p className='title'>{item?.name}</p>
      
                  <div className='cart-view'>
                    <Link to={`/view-item/${item?.id}`}>
                    <button>View Item</button>
                    </Link>
                    <p  id={item?.id} name={item?.farm}>add to cart</p>
                  </div>
                  <p style={{textAlign:'center',marginTop:'10px',fontSize:'10px'}}>produced by </p>
                </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
    )}
    </>
  )
}

export default Farm