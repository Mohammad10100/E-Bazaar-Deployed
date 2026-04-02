import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import React, { useState, useEffect } from 'react'
import PaymentForm from './PaymentForm'
import axios from 'axios'

const PUBLIC_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(PUBLIC_KEY);

const StripeContainer = ({ setSuccess, success, amount = 50000 }) => {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Generate a secure PaymentIntent from our custom backend whenever Checkout mounts
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:4000";
    axios.post(`${apiUrl}/create-payment-intent`, { amount: amount })
      .then((res) => {
        setClientSecret(res.data.clientSecret)
      })
      .catch((error) => console.error("Could not fetch payment intent:", error));
  }, [amount]);

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#16a34a',
      colorBackground: '#ffffff',
      colorText: '#30313d',
      colorDanger: '#df1b41',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '12px',
    }
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="w-full">
      {clientSecret ? (
        <Elements stripe={stripePromise} options={options}>
          <PaymentForm success={success} setSuccess={setSuccess} />
        </Elements>
      ) : (
        <div className="flex flex-col items-center justify-center p-12">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 font-bold text-sm uppercase tracking-wider">Loading Secured Gateways</p>
        </div>
      )}
    </div>
  )
}

export default StripeContainer