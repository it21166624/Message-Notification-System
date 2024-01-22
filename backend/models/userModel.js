const mongoose = require('mongoose')
const validator = require('validator')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        required: true
    },

    serviceno: {
        type:  Number,
        required: true 
    }
})


//static login method
userSchema.static.login = async function(username, serviceno){

    if(!username || !serviceno){
        throw Error('All fields must be filled')
    }

    const user = await this.findOne({email})

    if(!user){
        throw Error('Incorrect email')
    }

    const match = await bcrypt.compare(serviceno, user.serviceno)

    if(!match){
        throw Error('Incorrect serviceno')
    }

    return user
}
module.exports = mongoose.model('user',userSchema)