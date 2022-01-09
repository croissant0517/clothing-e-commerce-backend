const express = require("express");
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000
// This is your test secret API key.
const stripe = require("stripe")('sk_test_51JjUcqGBBygI9WOW3rA0DzaaDuE3zd5oHxrx2chxwS3hJOG2mHPv5xGRhZKhGeBOpalcBbaHFBAmoshw8iQUWErf00CQjwGTez');

// app.use(express.static("public"));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("It is working!")
})

app.post("/create-payment-intent", async (req, res) => {
    const { total } = req.body;
    console.log("Payment total " + total);

    // Create a PaymentIntent with the order amount and currency
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: total*100,
            currency: "usd",
            payment_method_types: ['card'],
            // automatic_payment_methods: {
            //     enabled: true,
            // },
        });
    
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch(error) {
        console.log(error.message);
    }
});
  
app.listen(port, () => console.log("Node server listening on port " + port));