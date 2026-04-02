import React from 'react'
import './BeHelpers.scss'
import { useState } from 'react';
import { useEffect } from 'react';
import { ref } from 'firebase/storage';
import { storage } from '../../../firebase';
import { uploadBytesResumable } from 'firebase/storage';
import { getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import { async } from '@firebase/util';
import { setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { doc } from 'firebase/firestore';
import { useNavigate } from 'react-router';
const helperForm = {
  name: '',
  phoneNumber: '',
  address: '',
  city: '',
  wages: 0,
  about: "",
  age: null,
  gender: 'male',
  verified: false,
  adhrURL: '',
  profileImg: ''
}

const BeHelpers = ({ user }) => {
  const [stage, setStage] = useState(1);
  const [form, setForm] = useState(helperForm);
  const [file, setFile] = useState(null);
  const [adhaar, setAdhaar] = useState(null);
  const navigate = useNavigate();
  const { name, phoneNumber, address, city, wages, age, gender, verified, adhrURL, about, profileImg } = form;
  const [progress, setProgress] = useState(null);
  const handleHelperForm = async (e) => {
    e.preventDefault();
    const finalGender = gender || 'male';
    const missingFields = [];
    if (!name) missingFields.push('Name');
    if (!phoneNumber) missingFields.push('Phone Number');
    if (!address) missingFields.push('Address');
    if (!city) missingFields.push('City');
    if (!wages) missingFields.push('Wages');
    if (!age) missingFields.push('Age');
    if (!finalGender) missingFields.push('Gender');
    if (!about) missingFields.push('About');
    if (!profileImg) missingFields.push('Profile Image');
    if (!adhrURL) missingFields.push('Adhaar Card Image');

    if (missingFields.length === 0) {
      await setDoc(doc(db, 'helpers', user.uid), {
        name: name,
        phoneNumber: phoneNumber,
        address: address,
        city: city,
        wages: wages,
        about: about,
        age: age,
        gender: finalGender,
        verified: false,
        adhrURL: adhrURL,
        profileImg: profileImg
      })
      await updateDoc(doc(db, 'users', user.uid), {
        helper: true
      })
      navigate('/helpers');
    } else {
      toast.error(`Missing Info: ${missingFields.join(', ')}`)
    }
  }

  useEffect(() => {
    const uploadAdhaar = async () => {
      const data = new FormData();
      data.append("file", adhaar);
      data.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
      data.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: "POST", body: data,
        });
        const uploadedImage = await res.json();
        setForm((prev) => ({ ...prev, adhrURL: uploadedImage.url }));
        toast.success('Successfully Uploaded Adhaar Card');
      } catch (error) {
        console.error(error);
      }
    };
    adhaar && uploadAdhaar();
  }, [adhaar]);

  useEffect(() => {
    const uploadFile = async () => {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
      data.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: "POST", body: data,
        });
        const uploadedImage = await res.json();
        setForm((prev) => ({ ...prev, profileImg: uploadedImage.url }));
        toast.success('Successfully Uploaded Image');
      } catch (error) {
        console.error(error);
      }
    };
    file && uploadFile();
  }, [file]);

  const handleStage = () => {
    setStage(stage + 1);
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

  return (
    <div className='BeHelpers'>

      <form action="submit" onSubmit={handleHelperForm}>
        {stage === 1 && (
          <div className='hlp-1'>
            <h1>Thankyou for choosing us to help you!</h1>
            <button onClick={handleStage}>Become Helper</button>
          </div>
        )}
        {stage === 2 && (
          <div className='hlp-2'>
            <h1>Enter Your full name </h1>
            <input type="text" onChange={handleChange} id="name" value={name} />
            <button onClick={handleStage}>Continue</button>
          </div>
        )}
        {
          stage === 3 && (
            <div className='hlp-3'>
              <h1>Fill the following information</h1>
              <div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input type="number" placeholder='Enter your phone number' id='phoneNumber' onChange={handleChange} value={phoneNumber} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label htmlFor="Address">Address</label>
                  <input type="address" placeholder='Enter your address' id='address' onChange={handleChange} value={address} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label htmlFor="CityName">Village/City</label>
                  <input type="text" placeholder='Enter your Village/City name' id='city' onChange={handleChange} value={city} />
                </div>
              </div>
              <button onClick={handleStage}>Continue</button>
            </div>
          )
        }
        {
          stage === 4 && (
            <div className='hlp-4'>
              <h1>Few more steps to setup your Account :D</h1>
              <div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label htmlFor="wages">Wages (Please enter per hour wages)</label>
                  <input type="number" placeholder='Enter your phone number' id='wages' onChange={handleChange} value={wages} />
                </div>
              </div>
              <button onClick={handleStage}>Continue</button>
              <div className='hlp4-info'>
                <h1>How do you get paid?</h1>
                <p>On EBazaar we let you decide how much to charge for your field work on per hour basis. Once you are hired for work you will be paid on per hour basis for your work by the landword/farmer etc.</p>
              </div>
            </div>
          )
        }
        {
          stage === 5 && (
            <div className='hlp-5'>
              <h1>Almost there to list you as our Helper!</h1>
              <div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label htmlFor="age">Age (You should be above 18 to be a helper)</label>
                  <input type="number" placeholder='Enter your age' id='age' onChange={handleChange} value={age} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label htmlFor="gender">Gender</label>
                  <select name="" id="gender" onChange={handleChange} value={gender}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <h1 style={{ marginTop: '20px' }}>Verification</h1>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="aadharCard" className='aadharCard-l'>Upload your aadhar Card</label>
                <input type="file" id='aadharCard' placeholder='Upload file' onChange={(e) => setAdhaar(e.target.files[0])} />
                <p>Using your aadhar card information we verify your account. Verified account have <span className='text-green-600'>80%</span> more chances to be hired</p>
              </div>
              <button onClick={handleStage}>Continue</button>
            </div>
          )
        }
        {
          stage === 6 && (
            <div className='hlp-6'>
              <h1>Tell more about you/your skills</h1>
              <p>Be short and straight to the point. Tell about what work you can do. Your previous experience etc</p>
              <textarea name="" id="about" cols="30" rows="10" onChange={handleChange} value={about} ></textarea>
              <button onClick={handleStage}>Last Step</button>
            </div>
          )
        }
        {
          stage === 7 && (
            <div className='hlp-7'>
              <h1>Upload your photo (will be visible while listing you)</h1>
              <div className='upload-pic-c'>
                <input type="file" onChange={(e) => { setFile(e.target.files[0]) }} />
                <div className='upc-pic-preview'>
                  <img src={!profileImg ? ("https://i.stack.imgur.com/l60Hf.png") : (profileImg)} alt="" />
                </div>
              </div>
              <button type='submit'>Submit Form</button>
            </div>
          )
        }
      </form>
    </div>
  )
}

export default BeHelpers