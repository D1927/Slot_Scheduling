const mongoose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config({path : "./config.env"})

const PORT = process.env.PORT || 3000
const DB = process.env.DATABASE.replace("<db_password>" , process.env.PASSWORD)
const app = require("./app.js")

mongoose
    .connect(DB)
    .then((connection) => {
        console.log("Database Connected Successfully to " , mongoose.connection.name)

        const server = app.listen(PORT , () => {
            console.log(`Website Running on port ${PORT}`)
        })
    })
    .catch((err) => {
        console.log("Cannot Connect to Database :- " , err.name)
    })