const express = require("express")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")

const doctor_route = require("./Routes/Doctor")
const patient_route = require("./Routes/Patient")
const slot_route = require("./Routes/Slot")
const booking_route = require("./Routes/Booking")
const availability_route = require("./Routes/Availability")

const app = express()

app.use(cookieParser())
app.use((req , res , next) => {
    console.log("Incoming Cookies :- " , req.cookies)

    next()
})

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(morgan("dev"))

app.get("/" , (req , res) => {
    res
        .status(200)
        .json({
            status : "Success" ,
            message : "Backend is Running"
        })
})

// Mounting
app.use("/api/v1/doctor" , doctor_route)
app.use("/api/v1/patient" , patient_route)
app.use("/api/v1/slot" , slot_route)
app.use("/api/v1/availability" , availability_route)
app.use("/api/v1/booking" , booking_route)

module.exports = app