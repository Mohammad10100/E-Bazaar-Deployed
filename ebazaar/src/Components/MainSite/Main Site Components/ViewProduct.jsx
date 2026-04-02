import React, { useEffect, useState } from 'react'
import './ViewProducts.scss'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'
import { collection, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../../firebase'
import { doc } from 'firebase/firestore'
import { useContext } from 'react'
import { UserContext } from '../../../Context/user.context'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { onSnapshot } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { async } from '@firebase/util'

const ViewProduct = ({ user }) => {
  const { id } = useParams()
  const [num, setNum] = useState(1)
  const [item, setItem] = useState(null);
  const { currentUser, userDB } = useContext(UserContext)
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState([])
  const [farm, setFarm] = useState(null)
  const [member, setMember] = useState(null)
  const [isMember, setIsMember] = useState(false)
  const getFarmData = async () => {
    const docRef = doc(db, 'farm', item?.farm)
    const docSnap = await getDoc(docRef)
    setFarm({ id: docSnap.id, ...docSnap.data() })
  }


  const getMemberData = async () => {
    if (!farm) {
      return;
    }
    const membersRef = collection(db, 'farm', farm.id, 'members');
    const docSnap = await getDocs(membersRef);
    const data = [];
    docSnap.forEach((doc) => {
      data.push(doc.data());
    });
    setMember(data);
  };

  useEffect(() => {
    getMemberData();
  }, [farm]);

  useEffect(() => {
    if (member && user) {
      setIsMember(member.findIndex(obj => obj.userID === user.uid) !== -1)
    }
  }, [member, user]);

  useEffect(() => {
    getUserData();
    console.log('rendering')
  }, [id])

  useEffect(() => {
    getFarmData();
  }, [item]);

  useEffect(
    () => {
      setLiked(likes.findIndex((like) => like.id === currentUser.uid) !== -1)
    }, [likes]
  )

  useEffect(() => {
    onSnapshot(collection(db, 'product', id, 'likedBy'), (snapshot) => { setLikes(snapshot.docs) })
  }, [db, id])

  const getUserData = () => {
    const docRef = doc(db, 'product', id);
    onSnapshot(docRef, (doc) => {
      setItem(doc.data());
    });
  };

  const handleLike = async () => {
    await setDoc(doc(db, 'product', id, 'likedBy', currentUser.uid), {
      userID: currentUser.uid,
    })
    toast.success("Liking a product helps it to reach more users")
    const docRef = doc(db, 'product', id)
    await updateDoc(docRef, {
      likedBy: likes.length,
    })
  }

  // const handleLike=async()=>{
  //   const docRef=doc(db,'product',id)
  //   await updateDoc(docRef,{
  //       likedBy:item?.likedBy+1,
  //   })
  //   window.location.reload()
  // }

  const handleClick = async (e) => {
    if (userDB?.address && userDB?.city && userDB?.zipcode && userDB?.state) {
      if (item?.stock - num >= 0) {
        await setDoc(doc(db, 'users', currentUser.uid, 'cart', id), {
          quantity: num,
          price: item?.price,
          name: item?.name,
          userCart: currentUser.uid,
          userName: userDB?.name,
          farm: item?.farm,
          productURL: item?.productURL,
          unit: item?.unit,
          address: userDB?.address,
          state: userDB?.state,
          email: userDB?.email,
        })
        await updateDoc(doc(db, 'product', id), {
          stock: (item?.stock - num),
        })
        toast.success(`Item Added to the Cart`)
      } else {
        toast.error('Out of stock!')
      }
    }
    else {
      toast.error("Please update your address in your profile to place orders")
    }
  }
  const handleDec = () => {
    if (num - 1 > 0) {
      setNum(num - 1);
    }
  }

  const handleInc = () => {
    setNum(num + 1)
  }

  useEffect(() => {

  }, [])
  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <Link to={`/farm/${farm?.id}`} className="inline-flex items-center text-green-700 hover:text-green-900 font-medium mb-8 transition-colors group">
          <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          {farm?.name || "Return to Farm"}
        </Link>

        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col md:flex-row">
          {/* Left Column: Image */}
          <div className="md:w-1/2 relative bg-gray-50">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${item?.productURL || 'https://images.unsplash.com/photo-1596434458316-2dafc819fbc4?auto=format&fit=crop&q=80&w=800'})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:hidden"></div>
            </div>
            {/* Aspect ratio placeholder */}
            <div className="pb-[100%] md:pb-[120%]"></div>

            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
              <ThumbUpIcon className={`w-5 h-5 ${liked ? 'text-green-600' : 'text-gray-400 cursor-pointer hover:text-green-500'}`} onClick={!liked ? handleLike : undefined} />
              <span className="font-bold text-gray-800">{likes.length} Likes</span>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="md:w-1/2 p-8 lg:p-12 flex flex-col">
            <div className="mb-6">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{item?.name}</h1>
              <div className="flex items-end gap-4">
                <p className={`text-3xl font-bold ${isMember ? 'text-gray-400 line-through text-xl' : 'text-green-600'}`}>
                  Rs. {item?.price} <span className="text-lg font-medium text-gray-500">/ {item?.unit}</span>
                </p>
                {isMember && (
                  <p className="text-3xl font-bold text-green-600">
                    Rs. {item?.discountPrice} <span className="text-lg font-medium text-gray-500">/ {item?.unit}</span>
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-sm rounded-md align-middle">Member Price</span>
                  </p>
                )}
              </div>
            </div>

            <div className="mb-8 flex-grow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {item?.description || "A wonderful local product harvested recently. Enjoy the best quality directly from our farm to your table."}
              </p>
            </div>

            <div className="border-t border-gray-100 pt-8 mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-700 font-medium">Availability</span>
                {item?.stock == 0 ? (
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full font-semibold text-sm">Out of Stock</span>
                ) : (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold text-sm">{item?.stock} {item?.unit}s in stock</span>
                )}
              </div>

              {item?.stock > 0 && (
                <div className="flex items-center gap-6 mt-6">
                  <div className="flex items-center bg-gray-100 rounded-xl p-1">
                    <button onClick={handleDec} className="w-10 h-10 flex items-center justify-center rounded-lg bg-white text-gray-600 font-bold shadow-sm hover:text-green-600 hover:shadow transition-all">-</button>
                    <span className="w-12 text-center font-bold text-lg">{num}</span>
                    <button onClick={handleInc} className="w-10 h-10 flex items-center justify-center rounded-lg bg-white text-gray-600 font-bold shadow-sm hover:text-green-600 hover:shadow transition-all">+</button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <button
                onClick={handleClick}
                disabled={item?.stock == 0}
                className="flex-1 py-4 rounded-xl bg-green-50 text-green-700 font-bold text-lg hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
              {/* <button
                disabled={item?.stock == 0}
                className="flex-1 py-4 rounded-xl bg-green-600 text-white font-bold text-lg shadow-lg shadow-green-600/30 hover:bg-green-700 hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Buy Now
              </button> */}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewProduct