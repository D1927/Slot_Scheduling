const Availability = require("./../Models/Availability")
const Slot = require("./../Models/Slot")
const handler_factory = require("./../Controllers/handler_factory")
const catch_async = require("./../Utilities/catch_error_for_async")
const generate_slots = require("./../Utilities/generate_slots")
const notify_affected_patients = require("./../Utilities/notify_affected_patients")
const format_slot = require("./../Utilities/format_slots")

// To get availabilities of particular doctor (for doctor and patient)
exports.know_availability_of_doctor = handler_factory.get_all_document(Availability) // Here we have to use filter as doctor id 

// To delete availability of particular doctor (for doctor)
exports.delete_availability_of_doctor = handler_factory.delete_document_by_id(Availability)

// To post availability (from doctor)
exports.announce_availability = catch_async(async (req , res , next) => {
    const doctors_availability = await Availability.create(req.body)

    const slots = generate_slots(doctors_availability)
    await Slot.insertMany(slots) // To insert in DB 

    const formatted_slots = slots.map(format_slot)

    res
        .status(201)
        .json({
            status : "Success" ,
            message : "Slots Created !" ,
            data : formatted_slots
        })
})

// To change availability of doctor
exports.change_availability_of_doctor = catch_async(async (req , res , next) => {
    const availability = await Availability.findById(req.params.id)

    if (!availability)
        return next(new Error("Availability not found"))

    const old_start = new Date(availability.start_time)
    const old_end = new Date(availability.end_time)
    const old_duration = availability.slot_duration
    const old_buffer = availability.buffer_time

    availability.set(req.body)
    await availability.save()

    const new_start = new Date(availability.start_time)
    const new_end = new Date(availability.end_time)

    const affected_slots = await Slot.find({
        doctor : availability.doctor ,
        status : "Booked" ,
        $or : [
            { start_time : { $lt : new_start }} ,
            { end_time : { $gt : new_end }}
        ]
    })

    await notify_affected_patients(affected_slots)

    // If duration or buffer changes regenerate all available slots
    if (old_duration !== availability.slot_duration || old_buffer !== availability.buffer_time) {
        await Slot.deleteMany({
            doctor : availability.doctor ,
            availability : availability._id ,
            status : "Available"
        })

        const new_slots = generate_slots(availability)
        await Slot.insertMany(new_slots)
    }

    else {
        await Slot.deleteMany({
            doctor : availability.doctor ,
            availability : availability._id ,
            status : "Available" ,
            $or : [
                { start_time : { $lt : new_start }} ,
                { end_time : { $gt : new_end }}
            ]
        })

        if (new_start < old_start) {
            const extra_availability = {
                ...availability.toObject(),
                start_time : new_start,
                end_time : old_start
            }

            const new_slots = generate_slots(extra_availability)
            await Slot.insertMany(new_slots)
        }

        if (new_end > old_end) {
            const extra_availability = {
                ...availability.toObject(),
                start_time : old_end,
                end_time : new_end
            }

            const new_slots = generate_slots(extra_availability)
            await Slot.insertMany(new_slots)
        }
    }

    res
        .status(200)
        .json({
            status : "Success",
            message : "Availability updated successfully"
        })
})