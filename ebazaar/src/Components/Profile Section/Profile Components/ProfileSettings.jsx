import { doc, updateDoc } from 'firebase/firestore'
import React, { useState, useEffect, useContext } from 'react'
import { db } from '../../../firebase'
import { UserContext } from '../../../Context/user.context'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom';
import VerifiedIcon from '@mui/icons-material/Verified';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import StorefrontIcon from '@mui/icons-material/Storefront';

const ProfileSettings = () => {
  const { currentUser, userDB } = useContext(UserContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: '', city: '', verified: false, email: '', state: '', zipcode: '', address: ''
  });

  // Cloudinary Image Upload State
  const defaultAvatar = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [photoURL, setPhotoURL] = useState(defaultAvatar);

  const { name, city, verified, email, state, zipcode, address } = data;

  // Reactively populate the form once UserContext fully loads from Firebase
  useEffect(() => {
    if (userDB) {
      setData({
        name: userDB.name || '',
        city: userDB.city || '',
        verified: userDB.verified || false,
        email: userDB.email || '',
        state: userDB.state || '',
        zipcode: userDB.zipcode || '',
        address: userDB.address || ''
      });
      if (userDB.photoURL) {
        setPhotoURL(userDB.photoURL);
      }
    }
  }, [userDB]);

  // Handle Image Upload automatically when file is selected
  useEffect(() => {
    const uploadFile = async () => {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
      formData.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: "POST", body: formData,
        });
        const uploadedImage = await res.json();
        setPhotoURL(uploadedImage.url);
        toast.success("Profile photo uploaded!");

        // Save it to firebase immediately upon upload
        if (currentUser) {
          const docRef = doc(db, 'users', currentUser.uid);
          await updateDoc(docRef, { photoURL: uploadedImage.url });
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to upload image.");
      }
      setIsUploading(false);
    };

    if (file) {
      uploadFile();
    }
  }, [file, currentUser]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const updateProfile = async (e) => {
    e.preventDefault()
    const docRef = doc(db, 'users', currentUser.uid)
    await updateDoc(docRef, {
      name, city, zipcode, state, address, email
    })
    toast.success('Profile updated successfully')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-transparent pb-20 relative">
      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100 rounded-full blur-[120px] opacity-70"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-50 rounded-full blur-[120px] opacity-70"></div>
      </div>

      {/* Original Glaciers Banner - Intentionally Reverted per Request */}
      <div
        className="h-64 sm:h-80 w-full bg-cover bg-center rounded-b-[3rem] shadow-sm relative overflow-hidden"
        style={{ backgroundImage: 'url(https://thumbs.dreamstime.com/b/natural-background-banner-glaciers-snow-hillside-185879590.jpg)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/10 to-transparent"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-28 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 overflow-hidden">

          {/* Profile Header & Avatar */}
          <div className="px-8 sm:px-12 flex flex-col sm:flex-row items-center sm:items-end gap-8 pb-10 border-b border-gray-100/50 pt-8">
            <div className="relative group cursor-pointer inline-block">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                title="Change Profile Picture"
                accept="image/*"
              />
              <img
                src={photoURL}
                alt="Profile Avatar"
                className={`w-36 h-36 rounded-full border-[6px] border-white shadow-xl object-cover bg-white group-hover:scale-105 transition-transform duration-300 ${isUploading ? 'opacity-50 blur-sm' : ''}`}
              />
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                <span className="text-white text-xs font-bold uppercase tracking-wider">{isUploading ? 'Uploading...' : 'Change'}</span>
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">{name || 'Your Profile'}</h1>
              <div className="mt-3 flex items-center justify-center sm:justify-start gap-3">
                {verified ? (
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                    <VerifiedIcon fontSize="small" /> Verified Member
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold bg-amber-50 text-amber-600 border border-amber-100 shadow-sm">
                    <ErrorOutlineIcon fontSize="small" /> Unverified <button className="ml-1 underline hover:text-amber-800 transition-colors">Verify Now</button>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Settings Form */}
          <form onSubmit={updateProfile} className="p-8 sm:p-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                <SettingsSuggestIcon />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900">Account Configurations</h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Manage your public display details and shipping defaults.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
              {/* Floating Label Input Design */}
              <div className="relative group">
                <input
                  value={name} onChange={handleChange} type="text" name="name" id="name" required
                  className="peer w-full bg-white/50 border border-gray-200 text-gray-900 rounded-2xl px-5 pt-6 pb-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:bg-white outline-none transition-all shadow-sm"
                  placeholder=" "
                />
                <label htmlFor="name" className="absolute text-sm font-bold text-gray-400 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-green-600">
                  Display Name
                </label>
              </div>

              <div className="relative group">
                <input
                  value={email} onChange={handleChange} type="email" name="email" id="email" required
                  className="peer w-full bg-white/50 border border-gray-200 text-gray-900 rounded-2xl px-5 pt-6 pb-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:bg-white outline-none transition-all shadow-sm"
                  placeholder=" "
                />
                <label htmlFor="email" className="absolute text-sm font-bold text-gray-400 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-green-600">
                  Email Address
                </label>
              </div>

              <div className="relative group sm:col-span-2">
                <input
                  value={address} onChange={handleChange} type="text" name="address" id="address" required
                  className="peer w-full bg-white/50 border border-gray-200 text-gray-900 rounded-2xl px-5 pt-6 pb-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:bg-white outline-none transition-all shadow-sm"
                  placeholder=" "
                />
                <label htmlFor="address" className="absolute text-sm font-bold text-gray-400 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-green-600">
                  Street Address
                </label>
              </div>

              <div className="relative group">
                <input
                  value={city} onChange={handleChange} type="text" name="city" id="city" required
                  className="peer w-full bg-white/50 border border-gray-200 text-gray-900 rounded-2xl px-5 pt-6 pb-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:bg-white outline-none transition-all shadow-sm"
                  placeholder=" "
                />
                <label htmlFor="city" className="absolute text-sm font-bold text-gray-400 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-green-600">
                  City / District
                </label>
              </div>

              <div className="relative group">
                <input
                  value={state} onChange={handleChange} type="text" name="state" id="state" required
                  className="peer w-full bg-white/50 border border-gray-200 text-gray-900 rounded-2xl px-5 pt-6 pb-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:bg-white outline-none transition-all shadow-sm"
                  placeholder=" "
                />
                <label htmlFor="state" className="absolute text-sm font-bold text-gray-400 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-green-600">
                  State / Province
                </label>
              </div>

              <div className="relative group">
                <input
                  value={zipcode} onChange={handleChange} type="text" name="zipcode" id="zipcode" required
                  className="peer w-full bg-white/50 border border-gray-200 text-gray-900 rounded-2xl px-5 pt-6 pb-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:bg-white outline-none transition-all shadow-sm"
                  placeholder=" "
                />
                <label htmlFor="zipcode" className="absolute text-sm font-bold text-gray-400 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-green-600">
                  ZIP / Postal Code
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-12 pt-8 border-t border-gray-100/60 flex flex-col-reverse sm:flex-row items-center justify-end gap-4">
              <button type="button" onClick={() => navigate(-1)} className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all shadow-sm">
                Discard Changes
              </button>
              <button type="submit" className="w-full sm:w-auto px-10 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                Save Profile
              </button>
            </div>
          </form>
        </div>

        {/* Farmer Upgrade Banner */}
        {!userDB?.admin && (
          <div className="mt-10 overflow-hidden rounded-[2rem] bg-gradient-to-br from-green-900 via-emerald-800 to-green-900 shadow-xl relative group">
            {/* Interactive Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent group-hover:opacity-20 transition-opacity duration-700"></div>

            <div className="relative p-10 sm:p-14 flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="flex items-start gap-6 text-center lg:text-left">
                <div className="hidden sm:flex flex-shrink-0 w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl items-center justify-center border border-white/20 text-green-300 shadow-inner">
                  <StorefrontIcon fontSize="large" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">Become a Verified Farmer!</h2>
                  <p className="text-emerald-100/90 text-lg leading-relaxed max-w-2xl font-medium">
                    Unlock the ability to list your own fresh produce, manage inventory, and directly reach thousands of customers across the EBazaar network.
                  </p>
                </div>
              </div>
              <Link to={'/profile/create-farm'} className="flex-shrink-0 w-full lg:w-auto">
                <button className="w-full lg:w-auto bg-white text-green-900 font-extrabold px-10 py-5 rounded-2xl shadow-[0_0_40px_rgb(255,255,255,0.2)] hover:shadow-[0_0_60px_rgb(255,255,255,0.4)] hover:bg-green-50 transition-all duration-300 text-lg flex items-center justify-center gap-2 transform hover:-translate-y-1">
                  <StorefrontIcon fontSize="small" className="opacity-70" /> Register Digital Farm
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfileSettings