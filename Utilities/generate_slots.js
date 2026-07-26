function generate_slots(availability) {
    let slots = []
    const start = new Date(availability.start_time) , end = new Date(availability.end_time)
    const buffer = availability.buffer_time , duration = availability.slot_duration , doctor = availability.doctor , avail = availability._id , dates = availability.date
   
    while ((start.getTime() + (duration * 60 * 1000)) <= end.getTime()) { // Available window
        const start_slot = new Date(start) , end_slot = new Date(start)
        end_slot.setMinutes(start_slot.getMinutes() + duration)
        
        slots.push({ // Make slots as per window
            "start_time" : start_slot ,
            "end_time" : end_slot ,
            "doctor" : doctor ,
            "availability" : avail ,
            "date" : dates
        })  

        start.setMinutes(start.getMinutes() + duration + buffer)
    }
    return slots
}

module.exports = generate_slots