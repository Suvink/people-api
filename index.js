const express = require('express');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
var bodyParser = require('body-parser');

var serviceAccount = require("./service-account.json");

const app = express();

app.use(bodyParser.json());

initializeApp({
    credential: cert(serviceAccount),
    databaseURL: "people-api-87d34.firebaseio.com"
});

app.get('/', function (req, res) {
    res.send('Hello World')
});

app.get("/people", function (req, res) {
    try {
        const db = getFirestore();
        const people = db.collection("people");
        people.get().then((snapshot) => {
            const peopleList = [];
            snapshot.forEach((doc) => {
                peopleList.push(doc.data());
            });
            res.send(peopleList);
        })
    } catch (error) {
        res.status(500);
        res.send({
            message: "Error getting people list",
            error: error
        });
    }
});

app.post("/people", function (req, res) {
    const requestBody = req.body;
    if (!requestBody.name && !requestBody.company) {
        try {
            const db = getFirestore();
            const people = db.collection("people");
            people.add(requestBody).then(() => {
                res.send({
                    message: "Person added successfully",
                    person: requestBody
                });
            });
        } catch (error) {
            res.status(500);
            res.send({
                message: "Error adding person",
                error: error
            });
        }
    } else {
        res.status(400);
        res.send({
            message: "Name and company are required",
            person: requestBody
        })
    }


});

app.listen(3000);