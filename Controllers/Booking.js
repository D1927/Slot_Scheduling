const mongoose = require("mongoose")
const Booking = require("./../Models/Booking")
const Slot = require("./../Models/Slot")
const handler_factory = require("./../Controllers/handler_factory")
const catch_async = require("./../Utilities/catch_error_for_async")
const app_error = require("../Utilities/error_class")

// To book appointments 
exports.book_appointment = catch_async(async (req, res, next) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        const slot = await Slot.findOneAndUpdate({
                _id: req.body._id,
                status: "Available"
            }, {
                status: "Booked"
            }, {
                new: true,
                session
            }
        )
        if (!slot) {
            await session.abortTransaction()
            session.endSession()
            return next(new app_error("Slot is already booked!", 409))
        }

        const appointment = await Booking.create([{
                patient: req.body.patient,
                doctor: req.body.doctor,
                slot: slot._id,
                appointment_type: req.body.appointment_type
            }],
            { session }
        )

        await session.commitTransaction()
        session.endSession()

        res
            .status(201)
            .json({
                status: "Success",
                message: "Your Appointment is Fixed!",
                data: appointment[0]
            })

    }
    catch (err) {
        await session.abortTransaction()
        session.endSession()
        return next(err)
    }

})

// To get all bookings
exports.get_all_bookings = handler_factory.get_all_document(Booking)

// To cancel appointment
exports.cancel_appointment = catch_async(async (req , res , next) => {
    const booking = await Booking.findById(req.params.id)

    if (!booking)
        return next(new app_error("No booking found !" , 404))

    booking.status = "Cancelled"
    await booking.save()

    const slot = await Slot.findById(booking.slot)

    slot.status = "Available"
    await slot.save()

    res
        .status(200)
        .json({
            status : "Success",
            message : "Appointment cancelled successfully"
        })
})
