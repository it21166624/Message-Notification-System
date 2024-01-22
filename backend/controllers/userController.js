const User = require('../models/userModel')

//login user
const loginUser = async (req,res) => {
    const {username,serviceno} = req.body
    
    try{
        const user = await User.login(username,serviceno)

        //create a token 
        const token = createToken(user._id)

        res.status(200).json({username,token})

    }catch(error){
        res.status(400).json({error: error.message})
    }

}

module.exports = {loginUser}