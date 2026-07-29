const mongoose = require("mongoose")
const { User } = require("../db.js")

const signupMiddleware = async (req, res, next) => {
    
    const user = await User.findOne({
        username: req.body.username
    })

    if(user){
        return res.status(409).json({
            message: "User already exists"
        })
    }

    next()
}

module.exports = {
    signupMiddleware
}