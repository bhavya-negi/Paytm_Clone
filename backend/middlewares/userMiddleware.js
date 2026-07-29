const {JWT_SECRET} = require("../configure")
const { User } = require("../db")
const jwt = require("jsonwebtoken")

const userMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization
    
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(403).json({
            message: "forbiden 1",
        });
    }
    
    const token = authHeader.split(" ")[1]
    

    try {
        const decoded = jwt.verify(token, JWT_SECRET)

        if(decoded.userId){
            req.userId = decoded.userId
            next()
        }else{
            res.status(403).json({
                "message": "forbiden 2"
            });
        }
    } catch (err) {
        res.status(403).json({
            "message": "forbiden 3"
        })
    }
}

module.exports = {
    userMiddleware
}