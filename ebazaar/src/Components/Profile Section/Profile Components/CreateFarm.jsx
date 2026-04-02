import { ref } from 'firebase/storage'
import React, { useState, useEffect, useContext } from 'react'
import { toast } from 'react-toastify';
import { doc, setDoc, updateDoc } from 'firebase/firestore'
import { UserContext } from '../../../Context/user.context';
import { db } from '../../../firebase'
import { useNavigate } from 'react-router-dom';

const farmForm = {
  name: '',
  phoneNumber: '',
  email: '',
  address: '',
  state: '',
  city: '',
  zipcode: '',
  description: '',
  bannerURL: '',
  earning: 0
}

const CreateFarm = ({ user }) => {
  const [form, setForm] = useState(farmForm);
  const { name, email, phoneNumber, address, state, city, zipcode, description, bannerURL } = form;
  const [file, setFile] = useState(null)
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleForm = async (e) => {
    e.preventDefault();
    if (isUploading) return toast.info("Please wait for the banner image to finish uploading.");
    if (!bannerURL) return toast.error("Please select a banner image.");

    const docRef = doc(db, 'farm', user.uid);
    await setDoc(docRef, {
      name,
      phoneNumber,
      email,
      address,
      state,
      city,
      zipcode,
      description,
      bannerURL,
      earning: 0
    })
    const docRef2 = doc(db, 'users', user.uid)
    await updateDoc(docRef2, {
      admin: true
    })
    toast.success("Farm registered successfully!");
    navigate('/profile/dashboard');
  }

  useEffect(() => {
    const uploadFile = async () => {
      setIsUploading(true);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
      data.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: "POST",
          body: data,
        });
        const uploadedImage = await res.json();
        setForm((prev) => ({ ...prev, bannerURL: uploadedImage.url }));
        toast.success('Successfully Uploaded Image');
      } catch (error) {
        console.error(error);
        toast.error("Failed to upload image.");
      }
      setIsUploading(false);
    };
    if (file) {
      uploadFile();
    }
  }, [file]);

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden'>

        <div className="bg-green-600 px-8 py-10 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl text-center">Register Your Farm</h1>
          <p className="mt-2 text-green-100 text-lg text-center">Join the marketplace and start selling your fresh produce today.</p>
        </div>

        <form onSubmit={handleForm} className='p-8 sm:p-12 space-y-10'>

          {/* Section: Basic Info */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6">Basic Details</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Farm Name</label>
                <input value={name} type="text" placeholder="e.g. Green Meadows Farm" required name='name' onChange={handleChange} className="w-full xl:w-2/3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-5 py-3 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Upload Farm Banner</label>
                <input type="file" onChange={(e) => { setFile(e.target.files[0]) }} required={!bannerURL} className="w-full xl:w-2/3 text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:border-0 file:text-sm file:font-bold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 rounded-xl border border-gray-200 bg-gray-50" />
                {isUploading && <p className="text-sm text-amber-500 font-bold mt-3">Uploading banner...</p>}
                {bannerURL && !isUploading && (
                  <div className="mt-4 h-48 xl:w-2/3 w-full rounded-2xl bg-cover bg-center border border-gray-200 shadow-inner" style={{ backgroundImage: `url(${bannerURL})` }}></div>
                )}
              </div>
            </div>
          </div>

          {/* Section: Contact */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6">Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                <input value={phoneNumber} type="number" name='phoneNumber' placeholder="e.g. 9876543210" required onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-5 py-3 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <input value={email} type="email" name='email' placeholder="farm@example.com" required onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-5 py-3 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
              </div>
            </div>
          </div>

          {/* Section: Address */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6">Address & Location</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Street Address</label>
                <input value={address} type="text" placeholder="123 Country Road..." name='address' required onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-5 py-3 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">City / Village</label>
                  <input value={city} type="text" name='city' placeholder="City" required onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-5 py-3 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">State</label>
                  <input value={state} type="text" name='state' placeholder="State" required onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-5 py-3 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Zipcode / Postal</label>
                  <input value={zipcode} type="text" name='zipcode' placeholder="000000" required onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-5 py-3 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Description */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6">About Your Farm</h2>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Tell customers what makes your farm special</label>
              <textarea value={description} name="description" rows="5" placeholder="We use 100% organic compost..." required onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-5 py-3 focus:ring-2 focus:ring-green-500 outline-none transition-all"></textarea>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-6">
            <button type='submit' disabled={isUploading} className="w-full sm:w-auto px-10 py-4 text-white font-extrabold text-lg rounded-xl bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              {isUploading ? 'Registering...' : 'Register Farm Account'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default CreateFarm