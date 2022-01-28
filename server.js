const express = require("express");
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001
// This is your test secret API key.
const stripe = require("stripe")('sk_test_51JjUcqGBBygI9WOW3rA0DzaaDuE3zd5oHxrx2chxwS3hJOG2mHPv5xGRhZKhGeBOpalcBbaHFBAmoshw8iQUWErf00CQjwGTez');

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
            amount: total,
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

// webhook

// const endpointSecret = "whsec_TMVQujNl3kKv4jBb85AHeAeCtvrumxS0";

app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
    let event = request.body;

    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    // if (endpointSecret) {
    //     // Get the signature sent by Stripe
    //     const signature = request.headers['stripe-signature'];
    //     try {
    //     event = stripe.webhooks.constructEvent(
    //         request.body,
    //         signature,
    //         endpointSecret
    //     );
    //     } catch (err) {
    //     console.log(`⚠️  Webhook signature verification failed.`, err.message);
    //     return response.sendStatus(400);
    //     }
    // }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
            console.log(paymentIntent);
            // Then define and call a method to handle the successful payment intent.
            // handlePaymentIntentSucceeded(paymentIntent);
            
            break;
        case 'payment_method.attached':
            const paymentMethod = event.data.object;
            // Then define and call a method to handle the successful attachment of a PaymentMethod.
            // handlePaymentMethodAttached(paymentMethod);
            break;
        default:
            // Unexpected event type
            console.log(`Unhandled event type ${event.type}.`);
    }
    // Return a 200 response to acknowledge receipt of the event
    response.send();
});

app.listen(port, () => console.log("Node server listening on port " + port));