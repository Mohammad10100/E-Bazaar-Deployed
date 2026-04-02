import React from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const PUBLIC_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
const stripeTestPromise = loadStripe(PUBLIC_KEY);
const StripeContainer = () => {
  return (
    <Elements stripe={stripeTestPromise}>
      <PaymentForm />
    </Elements>
  )
}

export default StripeContainer