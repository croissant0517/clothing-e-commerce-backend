// This is your test secret API key.
const stripe = require("stripe")('sk_test_51JjUcqGBBygI9WOW3rA0DzaaDuE3zd5oHxrx2chxwS3hJOG2mHPv5xGRhZKhGeBOpalcBbaHFBAmoshw8iQUWErf00CQjwGTez');


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
    
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch(error) {
        console.log(error.message);
    }
}

module.exports = {
    handleCreatePaymentIntent: handleCreatePaymentIntent,
}