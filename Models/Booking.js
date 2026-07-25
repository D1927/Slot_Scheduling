const mongoose = require("mongoose")

const booking_schema = new mongoose.Schema({
    appointment_type : {
        type : String ,
        enum : {
            values : ["First Time" , "Follow Up "] ,
            message : "Select only from First Time or Follow Up !"
        } ,
        default : "First Time"
    } ,
    status : {
        type : String ,
        enum : {
            values : ["Booked" , "Cancelled"] , // Cancelled for when doctor change availability
            message : "Status must be Booked or Cancelled only !"
        } ,
        default : "Booked"
    } ,
    patient_id : {
        type : mongoose.Schema.ObjectId ,
        ref : "Patient" ,
        required : [true , "Patient ID is must for making appointments !"]
    } ,
    slot_id : {
        type : mongoose.Schema.ObjectId ,
        ref : "Slot" ,
        required : [true , "Slot ID is must for making appointments !"]
    }
} , {
    timestamps : true
})

const Booking = mongoose.model("Booking" , booking_schema)

module.exports = Booking