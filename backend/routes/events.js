const router = require("express").Router();
let Event = require("../models/Event");

router.route("/add").post((req, res) => {

    const username = req.body.username;
    const time = Number(req.body.time);
    const date = Number(req.body.date);
    const description = req.body.description;
    const serviceno = Number(req.body.serviceno);
    const event = req.body.event;

    const newEvent = new Event({

        username,
        time,
        date,
        description,
        serviceno,
    })

    newEvent.save().then(() => {
        res.json("User added")
    }).catch((err) => {
        console.log(err);
    })

})


router.route("/").get((req, res) => {

    Event.find().then((events) => {
        res.json(events)

    }).catch((err) => {
        console.log(err)
    })

})


module.exports = router;