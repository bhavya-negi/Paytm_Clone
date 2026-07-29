const express = require("express")
const { success } = require("zod")
const { createUser, signinUser, updateUser } = require("../types")
const { signupMiddleware } = require("../middlewares/signupMiddleware")
const jwt = require("jsonwebtoken")
const {JWT_SECRET} = require("../configure")
const { User, Account } = require("../db")
const { userMiddleware } = require("../middlewares/userMiddleware")

const router = express.Router()

router.post("/signup", signupMiddleware, async (req, res) => {
    const {success} = createUser.safeParse(req.body)
    if(!success){
        return res.json({
            message: "Invalid Inputs"
        })
    }

    const dbUser = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    })

    const userId = dbUser._id

    await Account.create({
        userId,
        balance: 1 + Math.random() * 1000
    })

    const token = jwt.sign({
        userId
    },JWT_SECRET)

    return res.json({
        message: "User successfully created",
        token: token
    })

})

router.post("/signin", async (req, res) => {
    const {success} = signinUser.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            message: "incorrect Inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    })

    if(user){
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET)

        res.json({
            token: token
        })
        return
    }

    res.status(411).json({
        message: "Error while logging in"
    })
})

router.put("/", userMiddleware, async (req, res) => {
    const {success} = updateUser.safeParse(req.body)
    if(!success){
        req.status(411).json({
            message: "Error while updating information"
        })
    }

    const user = await User.updateOne({
        _id: req.userId
    },{
        $set: {
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }
    })

    res.status(200).json({
        message: "Updated successfully"
    })
})

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || ""

    const users = await User.find({
        _id: { $ne: req.userId },

        $or: [{
            firstName: {
                "$regex": filter
            }
        },{
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            id: user._id
        }))
    })
})

module.exports = router