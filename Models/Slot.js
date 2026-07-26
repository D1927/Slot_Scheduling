const mongoose = require("mongoose")

const slot_schema = new mongoose.Schema({
    date : {
        type : Date ,
        required : [true , "Date is must !"]
    } ,
    start_time : {
        type : Date ,
        required : [true , "Start time is must !"]
    } ,
    end_time : {
        type : Date ,
        required : [true , "End time is must !"]
    } ,
    status : {
        type : String ,
        enum : {
            values : ["Available" , "Booked" , "Held"] ,
            message : "Status must be Available , Booked or Held only !"
        } ,
        default : "Available"
    } ,
    doctor : {
        type : mongoose.Schema.ObjectId ,
        ref : "Doctor" ,
        required : [true , "Slot must be booked for a particular doctor"]
    } ,
    availability : {
        type : mongoose.Schema.ObjectId ,
        ref : "Availability" ,
        required : [true , "We must know which availability !"]
    }
} , {
    timestamps : true
})

slot_schema.index({ // For getting available slots fast
    doctor : 1 ,
    date : 1 ,
    status : 1
})

slot_schema.index({ // To ensure that each doctor has single slot at a given time
        doctor : 1 ,
        start_time : 1
    } , {
        unique : true
    }
)

const Slot = mongoose.model("Slot" , slot_schema)

module.exports = Slot