import React from 'react'
import './PaymentPage.scss'
import StripeContainer from './StripeContainer'

const PaymentPage = () => {
  return (
    <div className='PaymentPage'>
        <h1>Fill your payment details</h1>
        <StripeContainer/>
    </div>
  )
}

export default PaymentPage