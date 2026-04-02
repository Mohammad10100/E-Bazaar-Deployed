import React, { useEffect, useState } from "react";
import {
    PaymentElement,
    AddressElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";

export default function PaymentForm({ success, setSuccess }) {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!stripe) return;

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecret) return;

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent.status) {
                case "succeeded":
                    setMessage("Payment succeeded!");
                    if (setSuccess) setSuccess(true);
                    break;
                case "processing":
                    setMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    setMessage("Your payment was not successful, please try again.");
                    break;
                default:
                    setMessage("Something went wrong.");
                    break;
            }
        });
    }, [stripe, setSuccess]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/profile/order-page`,
            },
            redirect: "if_required",
        });

        if (error) {
            if (error.type === "card_error" || error.type === "validation_error") {
                setMessage(error.message);
            } else {
                setMessage("An unexpected error occurred.");
            }
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            setMessage("Payment succeeded! Finalizing order...");
            if (setSuccess) setSuccess(true);
            setTimeout(() => {
                navigate("/profile/order-page");
            }, 2000);
        }

        setIsLoading(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="w-full max-w-lg mx-auto bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-gray-100">
            <div className="mb-6">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Billing Details</h3>
                <AddressElement options={{ mode: 'billing' }} />
            </div>
            <div className="mb-4">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Payment Information</h3>
                <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
            </div>
            <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white font-extrabold text-lg py-4 rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span id="button-text">
                    {isLoading ? "Processing Gateway..." : "Pay Securely"}
                </span>
            </button>
            {message && <div id="payment-message" className={`mt-4 text-center text-sm font-bold ${message.includes('succeeded') ? 'text-green-600' : 'text-red-500'}`}>{message}</div>}
        </form>
    );
}