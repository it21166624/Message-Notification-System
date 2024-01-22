const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EventSchema = new Schema({

    username : {
        type : String,
        required: true
    },

    date : {
        type : Number,
        required: true 
    },

    time : {
        type : Number,
        required: true 
    },

    event : {
        type : String,
        required: true 
    },

    description : {
        type : String,
        required: true 
    },

    serviceno : {
        type : Number,
        required: true 
    }

})

const Event = mongoose.model("Event",EventSchema);

module.exports = Event;