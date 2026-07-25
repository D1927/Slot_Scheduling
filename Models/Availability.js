const mongoose = require("mongoose")

const availability_schema = new mongoose.Schema({
    date : {
        type : Date ,
        required : [true , "Date is must !"] ,
        trim : true
    } ,
    start_time : {
        type : String ,
        required : [true , "Start time is must !"] ,
        trim : true
    } ,
    end_time : {
        type : String ,
        required : [true , "End time is must"] ,
        trim : true
    } ,
    buffer_time : {
        type : Number , // In minutes
        default : 0
    } ,
    slot_duration : {
        type : Number , // In minutes
        default : 15
    } ,
    doctor_id : {
        type : mongoose.Schema.ObjectId ,
        ref : "Doctor" ,
        required : [true , "Doctor is must for making appointments !"]
    }
} , {
    timestamps : true
})

const Availability = mongoose.model("Availability" , availability_schema)

module.exports = Availability