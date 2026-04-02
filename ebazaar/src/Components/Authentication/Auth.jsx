import { LockClosedIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import GoogleIcon from '@mui/icons-material/Google';
import './Auth.scss'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../../firebase';
import { doc } from 'firebase/firestore';
import { setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
const AuthUserForm = {
  email: '',
  password: '',
  confirmPassword: '',
  name: ''
}
export default function Auth({ user }) {
  const [login, setLogin] = useState(true);
  const [authform, setAuthform] = useState(AuthUserForm)
  const { email, password, confirmPassword, name } = authform
  const navigate = useNavigate();
  const handleSignUp = () => {
    if (login) {
      setLogin(false)
    } else {
      setLogin(true)
    }
  }
  const handleChange = (e) => {
    setAuthform({ ...authform, [e.target.name]: e.target.value })
  }

  const handleAuth = async (e) => {
    e.preventDefault();

    if (login) {
      if (!email || !password) {
        return toast.error("Enter Email and Password");
      }
      try {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Welcome back!");
        navigate('/');
      } catch (error) {
        toast.error('Invalid Email or Password');
      }
    } else {
      // Signup Flow
      if (!name || !email || !password || !confirmPassword) {
        return toast.error("All fields are mandatory to fill");
      }
      if (password !== confirmPassword) {
        return toast.error("Passwords didn't match");
      }
      // Explicit Firebase criteria check
      if (password.length < 6) {
        return toast.error("Password must be at least 6 characters (Firebase Requirement)");
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, { displayName: name });
        await setDoc(doc(db, 'users', user.uid), {
          name: name,
          admin: false,
          create: true,
          email: email,
        });
        toast.success("Account registered successfully!");
        navigate('/');
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          toast.error("This email is already registered");
        } else if (error.code === 'auth/invalid-email') {
          toast.error("Invalid email format");
        } else {
          toast.error(error.message);
        }
      }
    }
  }

  return (
    <>
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg
          className="absolute top-0 left-[max(50%,25rem)] h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="e813992c-7d03-4cc4-a2bd-151760b470a0"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
            <path
              d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect width="100%" height="100%" strokeWidth={0} fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)" />
        </svg>
      </div>
      <div className='auth-container'>

        <div className='auth-div-1'>
        </div>
        <form className='auth-div-2' onSubmit={handleAuth}>
          <h1>Welcome to EBazaar</h1>
          <p className='signIn-text'>{login ? ('Sign In') : ('Sign Up')}</p>
          {!login && (<input type="text" placeholder='Full Name' name='name' value={name} onChange={handleChange} />)}
          <input type="email" placeholder='Email Address' name='email' value={email} onChange={handleChange} />
          <input type="password" placeholder='Password' name='password' value={password} onChange={handleChange} />
          {!login && (<input type="password" placeholder='Confirm Password' name='confirmPassword' value={confirmPassword} onChange={handleChange} />)}
          <button type='submit'>{login ? ('Sign In') : ('Register Account')}</button>
          {login ? (<p className='lg-btn'>Are you a new member? <span onClick={handleSignUp}>Sign Up</span></p>) : (<p className='lg-btn'>Already have an account? <span onClick={handleSignUp}>Sign In</span></p>)}
        </form>
      </div>
    </>
  )
}