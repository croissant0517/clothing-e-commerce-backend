const express = require("express");
const cors = require('cors');
const fetch = require('node-fetch');

if(process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

const signin = require("./controllers/admin/signin");
const users = require("./controllers/admin/users");
const collection = require("./controllers/admin/collection");
const order = require("./controllers/admin/order");
const slider = require("./controllers/admin/slider");
const activity = require("./controllers/admin/activity");
const stripe = require("./controllers/user/stripe");
const search = require("./controllers/user/search");
const auth = require("./middleware/auth");

const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp();
const db = getFirestore();
const app = express();
const port = process.env.PORT || 3001

// 本地端運行
const knex = require('knex')({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      database : 'overfit'
    }
});

// 部署至Heroku
// const knex = require('knex')({
//     client: 'pg',
//     connection: {
//         connectionString: process.env.DATABASE_URL,
//         ssl: {
//             rejectUnauthorized: false
//         }
//     }
// });

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("It is working!")
})

app.post("/admin/signin", (req, res) => {signin.signinAuthentication(req, res, knex)});


app.get("/admin/user", auth.requireAuthLevelTwo, (req, res) => {users.handleGetAllUsers(req, res)});
app.delete("/admin/user/delete", auth.requireAuthLevelOne, (req, res) => {users.handleDeleteUser(req, res, db)});

app.get("/admin/collections", (req, res) => {collection.handleGetAllCollection(req, res, db)});
app.post("/admin/collections/add", auth.requireAuthLevelOne, (req, res) => {collection.handleAddCollection(req, res, db)});
app.put("/admin/collections/update", auth.requireAuthLevelOne, (req, res) => {collection.handleUpdateCollection(req, res, db)});
app.delete("/admin/collections/delete", auth.requireAuthLevelOne, (req, res) => {collection.handleDeleteCollection(req, res, db)});

app.post("/admin/collections/item/add", auth.requireAuthLevelOne, (req, res) => {collection.handleAddItem(req, res, db)});
app.put("/admin/collections/item/update", auth.requireAuthLevelOne, (req, res) => {collection.handleUpdateItem(req, res, db)});
app.delete("/admin/collections/item/delete", auth.requireAuthLevelOne, (req, res) => {collection.handleDeleteItem(req, res, db)});

app.get("/admin/orders", auth.requireAuthLevelTwo, (req, res) => {order.handleGetAllOrders(req, res, db)});
app.post("/admin/orders/delete", auth.requireAuthLevelOne, (req, res) => {order.handleDeleteOrder(req, res, db)});

app.get("/admin/sliders", (req, res) => {slider.handleGetAllSliders(req, res, db)});
app.post("/admin/sliders/add", auth.requireAuthLevelOne, (req, res) => {slider.handleAddSlider(req, res, db)});
app.put("/admin/sliders/update", auth.requireAuthLevelOne, (req, res) => {slider.handleUpdateSlider(req, res, db)});
app.delete("/admin/sliders/delete", auth.requireAuthLevelOne, (req, res) => {slider.handleDeleteSlider(req, res, db)});

app.get("/admin/activity", (req, res) => {activity.handleGetActivity(req, res, db)});
app.post("/admin/activity/add", auth.requireAuthLevelOne, (req, res) => {activity.handleAddActivity(req, res, db)});
app.put("/admin/activity/update", auth.requireAuthLevelOne, (req, res) => {activity.handleUpdateActivity(req, res, db)});
app.delete("/admin/activity/delete", auth.requireAuthLevelOne, (req, res) => {activity.handleDeleteActivity(req, res, db)});

app.post("/create-payment-intent", (req, res) => {stripe.handleCreatePaymentIntent(req, res)});
app.get("/search", (req, res) => {search.handleUserSearch(req, res, db)});



// big-data-compony-test
app.get("/taipei-data", (req, res) => {
    let taipeiData = []
    fetch("https://od.moi.gov.tw/api/v1/rest/datastore/301000000A-000082-049")
    .then(res => res.json())
    .then(data => {
        data.result.records.forEach(eachData => {
            if (eachData.district_code[0] + eachData.district_code[1] === "63") {
              taipeiData.push(eachData)
            }
        })
        res.send(taipeiData)
    }).catch(error => console.log(error))
})

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