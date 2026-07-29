const express = require("express")
const mainRouter = require("./routes/index.js")
const app = express()
const cors = require("cors")

app.use(express.json());
app.use(cors());

app.use("/api/v1", mainRouter)

app.listen(3000)