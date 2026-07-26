const express = require("express")
const slot_controller = require("./../Controllers/Slot")

const router = express.Router()

router
    .route("/")
    .get(slot_controller.get_all_slots)

module.exports = router