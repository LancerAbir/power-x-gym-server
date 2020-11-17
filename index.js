const express = require("express");

//** ENV file */
require("dotenv").config();

//** Third Party Middleware */
const bodyParser = require("body-parser");
const cors = require("cors");

//** MongoDB Import */
const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0evig.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

//** Mother App */
const app = express();

//** Middle Ware */
const middleware = [
    express.urlencoded({ extended: true }),
    express.json(),
    bodyParser.json(),
    cors(),
];
app.use(middleware);

//** PORT */
const port = 7000;

//** Root Route */
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// //** MongoDB Set Up */
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

client.connect((err) => {
    //** MongoDB Collections list */
    const powerXGym = client
        .db(`${process.env.DB_NAME}`)
        .collection(`${process.env.DB_COLLECTION}`);
    console.log("Database Has Successfully Connected");

    //** POST --> Insert addMember & Save in Database */
    app.post("/addMember", (req, res) => {
        const addMemberShip = req.body;
        powerXGym.insertOne(addMemberShip).then((result) => {
            console.log(result.insertedCount);
            res.send(result.insertedCount > 0);
        });
    });

    //** GET --> Show All Member Data */
    app.get("/showMember", (req, res) => {
        powerXGym.find({}).toArray((error, documents) => {
            res.send(documents);
        });
    });

    //** Get --> Insert addMember & Save in Database */
    // app.get('/isUser', (req, res) => {
    // 	const email = req.query.email;
    // 	const data = y.email;
    // 	powerXGym.find({ data: email }).toArray((err, document) => {
    // 		res.send(document);
    // 	});
    // });

    //** GET --> Show All Single Service Data */
    app.get("/isUser", (req, res) => {
        console.log(req.query.email);
        powerXGym.find({ email: req.query.email }).toArray((err, documents) => {
            res.send(documents);
        });
    });
});
//https://shrouded-plains-89752.herokuapp.com/
//** App Listen */
app.listen(process.env.PORT || port);