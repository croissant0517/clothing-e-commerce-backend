// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const handleCreatePaymentIntent = async (req, res) => {
    const { total } = req.body;
    console.log("Payment total " + total);

    // Create a PaymentIntent with the order amount and currency
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: total,
            currency: "usd",
            payment_method_types: ['card'],
        });
        console.log(paymentIntent);
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch(error) {
        console.log(error);
    }
}

module.exports = {
    handleCreatePaymentIntent: handleCreatePaymentIntent,
}