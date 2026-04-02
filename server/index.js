const express = require("express")
const app = express()
require("dotenv").config()
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const bodyParser = require("body-parser")
const cors = require("cors")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cors({
	origin: process.env.FRONTEND_URL,
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	credentials: true
}))

// Modern Stripe Integration for UPI/Wallets
app.post("/create-payment-intent", async (req, res) => {
	const { amount } = req.body;
	try {
		const paymentIntent = await stripe.paymentIntents.create({
			amount: amount,
			currency: "inr",
			description: "EBazaar Checkout",
			payment_method_types: ["card"],
		});
		console.log(amount, "amount");
		console.log("STRIPE CONFIGURED PAYMENT TYPES:", paymentIntent.payment_method_types);

		res.json({
			clientSecret: paymentIntent.client_secret,
			types: paymentIntent.payment_method_types
		});
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
})
app.listen(process.env.PORT || 4000, () => {
	console.log("Sever is listening on port 4000")
})