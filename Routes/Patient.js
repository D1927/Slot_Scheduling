const express = require("express")
const patient_controller = require("./../Controllers/Patient")

const router = express.Router()

router
    .route("/")
    .get(patient_controller.get_patient)
    .post(patient_controller.enroll_patient)

router
    .route("/:id")
    .get(patient_controller.get_patient_using_id)
    .delete(patient_controller.delete_patient_using_id)
    

module.exports = router