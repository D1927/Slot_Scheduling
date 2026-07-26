const format_slot = slot => {
    const obj = typeof slot.toObject === "function" ? slot.toObject() : { ...slot }

    obj.start_time = new Date(obj.start_time).toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    })

    obj.end_time = new Date(obj.end_time).toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    })

    return obj
}

module.exports = format_slot