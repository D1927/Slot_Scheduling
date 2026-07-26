const express = require("express")
const availability_controller = require("./../Controllers/Availability")

const router = express.Router()

router
    .route("/")
    .post(availability_controller.announce_availability)
    

router
    .route("/:id")
    .patch(availability_controller.change_availability_of_doctor)    

module.exports = router