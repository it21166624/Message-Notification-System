const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const webPush = require('web-push');
const path = require('path');

const app = express();
require("dotenv").config();
const XLSX = require("xlsx");
const workbook = XLSX.readFile("./userData/Agenda.xlsx")
const userRoutes = require('./routes/user')

const worksheet = workbook.Sheets[workbook.SheetNames[0]];

for (let index = 2; index < 6; index++) {
    const userName = worksheet[`A${index}`].v;
    const serviceNo = worksheet[`B${index}`].w;
    const date = worksheet[`C${index}`].w;
    const time = worksheet[`D${index}`].w;
    const event = worksheet[`E${index}`].h;
    const description = worksheet[`F${index}`].v;
    const status = worksheet[`G${index}`].w;

    console.log({

        userName: userName,
        serviceNo: serviceNo,
        date: date,
        time: time,
        event: event,
        description: description,
        status: status,

    })
}

const PORT = process.env.PORT || 8070;

app.use(cors());
app.use(bodyParser.json());

const URL = process.env.MONGODB_URL;

mongoose.connect(URL);

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("Database connection success!");
})

const eventRouter = require("./routes/events.js");
const userRouter = require("./routes/user.js");
const { db } = require("./models/userModel");

app.use("/event", eventRouter);
app.use("/user", userRouter);




app.use(express.static('../build', {
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
            console.log("here");
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));


// Configure static folder for service worker
app.use(express.static(path.join(__dirname, 'public')));


// Replace with your VAPID keys
const vapidKeys = {
    publicKey: 'BKWzgUVSkMCneAV9HzjOwGDCN-ggYNugyWr-GRUmQsdwZJbOSKKZTALk0Hb0Znf7W9YapT_sFaT4cVPfXYtlAOY',
    privateKey: 'AwYRkn9c0_2gQwlQk_rZHXBRkJieGgig3uB9d8rhmyQ'
};

webPush.setVapidDetails(
    'mailto:dinuka0713@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

// Store subscriptions in memory (for demonstration purposes)
const subscriptions = [];



// Handle subscription from frontend

//send data to mongoDB
app.post('/api/subscribe', (req, res) => {
    console.log("subscription");
    const subscription = req.body;
    subscriptions.push(subscription);
    db.collection('subscriptions').insertOne(subscription);
    res.status(200).json({ message: 'Subscription successful' });
});

//

//get subcription data from mongoDB
app.get('/api/subscribe', (req, res) => {
    console.log("subscription");
    db.collection('subscriptions').find().toArray()
        .then(results => {
            res.status(200).json(results);
            results.forEach(subscription => {
                subscriptions.push(subscription);
            });
        })
        .catch(error => console.error(error))
});

//create functioin to send date and time to mongoDB
app.post('/api/dateTime', (req, res) => {
    console.log("dateTime");
    const dateTime = req.body;
    db.collection('dateTime').insertOne(dateTime);
    res.status(200).json({ message: 'dateTime successful' });
});

const dateTime = [];

function notifyNow() {
    const payload = JSON.stringify({ title: 'Push Notification', body: 'Hello, this is a push notification!' });
    console.log('success2');

    subscriptions.forEach(subscription => {
        webPush.sendNotification(subscription, payload).then(() => {
            console.log('success3');
        })
            .catch(error => {
                console.error('Error sending push notification:', error);
            });
    });

}

app.get('/sendNotification', (req, res) => {
    //     //retrive date and time from mongoDB
    //if date and time greater than currend date and time send notification
    console.log(dateTime + "is greater than" + Date.now());
    if (true) {
        console.log(dateTime + "is greater than" + Date.now());

        db.collection('subscriptions').find().toArray()
            .then(results => {
                res.status(200).json(results);
                results.forEach(subscription => {
                    subscriptions.push(subscription);
                });
            })
            .catch(error => console.error(error))
        notifyNow();
    }
})




// Send push notifications
// app.get('/api/send-notification', (req, res) => {
mongoose

function hello() {
    console.log('success1');

    const payload = JSON.stringify({ title: 'Push Notification', body: 'Hello, this is a push notification!' });
    console.log('success2');

    subscriptions.forEach(subscription => {
        webPush.sendNotification(subscription, payload).then(() => {
            console.log('success3');
        })
            .catch(error => {
                console.error('Error sending push notification:', error);
            });
    });

}
setTimeout(hello, 30000);

// });
// server.js

app.get('/service-worker.js', (req, res) => {
    console.log("DDDD");
    res.setHeader('Content-Type', 'application/javascript');
    // Rest of your code to send the service worker script
});
app.get('/h', (req, res) => {
    console.log(subscriptions);
    res.send('hello');
});

app.listen(PORT, () => {
    console.log(`Server is up and running on port number : ${PORT}`)
})









