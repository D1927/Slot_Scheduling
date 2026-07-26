const Booking = require("./../Models/Booking")
const send_email = require("./email")

async function notify_affected_patients(affected_slots) {
    const slot_ids = affected_slots.map(slot => slot._id)

    const appointments = await Booking.find({
        slot: { $in: slot_ids }
    })
    .populate("patient", "name email")
    .populate("slot", "start_time end_time")

    await Booking.updateMany(
        { _id: { $in: appointments.map(a => a._id) } },
        { status: "Cancelled" }
    )

    for (const appointment of appointments) {
        const patient = appointment.patient
        
        const start_time = appointment.slot.start_time.toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            dateStyle: "medium",
            timeStyle: "short"
        })

        await send_email({
            email: patient.email,
            subject: "Appointment Cancelled",
            message: `Dear ${patient.name},

We regret to inform you that your appointment scheduled on ${start_time} has been cancelled because your doctor is unavailable.

Please log in to the portal and choose another available slot.

We apologize for the inconvenience.

Regards,
Hospital Team`
        })

        await delay(2000)
    }
}

module.exports = notify_affected_patients