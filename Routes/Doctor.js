const express = require("express")
const doctor_controller = require("./../Controllers/Doctor")

const router = express.Router()

router
    .route("/")
    .get(doctor_controller.get_doctor)
    .post(doctor_controller.enroll_doctor)

router
    .route("/:id")
    .get(doctor_controller.get_doctor_using_id)
    .delete(doctor_controller.delete_doctor_using_id)
    

module.exports = router