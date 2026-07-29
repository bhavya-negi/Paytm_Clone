const express = require("express")
const { userMiddleware } = require("../middlewares/userMiddleware")
const { Account, User } = require("../db")
const { default: mongoose } = require("mongoose")

const router = express.Router()

router.get("/balance", userMiddleware, async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    })

    console.log(account);
    

    res.json({
        balance: account.balance
    })
})

router.post("/transfer", userMiddleware, async (req, res) => {
    const session = await mongoose.startSession()

    session.startTransaction()
    const { amount, to } = req.body

    const account = await Account.findOne({
        userId: req.userId
    }).session(session)

    if(!account || account.balance < amount){
        await session.abortTransaction()
        res.status(400).json({
            message: "Insufficient Balance"
        })
    }

    const toAccount = await Account.findOne({
        userId: to
    }).session(session)

    if(!toAccount){
        await session.abortTransaction()
        res.status(400).json({
            message: "Invalid Account"
        })
    }

    await Account.updateOne({
        userId: req.userId
    },{
        $inc: {
            balance: -amount
        }
    }).session(session)

    await Account.updateOne({
        userId : to
    },{
        $inc: {
            balance: amount
        }
    })

    await session.commitTransaction()

    res.json({
        message: "Transaction Completed"
    })
})


module.exports = router