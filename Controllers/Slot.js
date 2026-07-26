const Slot = require("./../Models/Slot")
const api_feature = require("./../Utilities/features_of_api")
const catch_async = require("./../Utilities/catch_error_for_async")
const app_error = require("./../Utilities/error_class")
const format_slot = require("./../Utilities/format_slots")

// Get all slots , we can sort and limit as per need
exports.get_all_slots = catch_async(async(req, res, next) => {

    const features = new api_feature(Slot.find(), req.query).filter().sort().field().page()
    const slots = await features.query
    const formatted_slots = slots.map(format_slot)

    res
        .status(200)
        .json({
            status: "Success",
            message: `Total ${slots.length} Slots are as follows :-`,
            data: {
                Slot: formatted_slots
            }
        })
})
