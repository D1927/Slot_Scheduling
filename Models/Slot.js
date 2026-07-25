const mongoose = require("mongoose")

const slot_schema = new mongoose.Schema({
    start_time : {
        type : String ,
        trim : true , 
        required : [true , "Start time is must !"]
    } ,
    end_time : {
        type : String ,
        trim : true ,
        required : [true , "End time is must !"]
    } ,
    status : {
        type : String ,
        enum : {
            values : ["Available" , "Booked" , "Freezed"] ,
            message : "Status must be Available , Booked or Freezed only !"
        } ,
        default : "Available"
    } ,
    doctor_id : {
        type : mongoose.Schema.ObjectId ,
        ref : "Doctor" ,
        required : [true , "Slot must be booked for a particular doctor"]
    }
} , {
    timestamps : true
})

const Slot = mongoose.model("Slot" , slot_schema)

module.exports = Slot