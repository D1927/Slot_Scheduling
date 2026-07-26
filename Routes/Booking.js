const express = require("express")
const Booking = require("./../Models/Booking")
const booking_controller = require("./../Controllers/Booking")

const router = express.Router()

router
    .route("/")
    .get(booking_controller.get_all_bookings)
    .post(booking_controller.book_appointment)
    
router
    .route("/:id")
    .patch(booking_controller.cancel_appointment)    

module.exports = router