const mongoose = require("mongoose")
const validator = require("validator")

const availability_schema = new mongoose.Schema({
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
        required : [true , "End time is must"] ,
        validate : {
            validator : function(el) {
                return (el >= this.start_time)
            } ,
            message : "Availability window can't be negative !"
        }
    } ,
    buffer_time : {
        type : Number , // In minutes
        default : 0
    } ,
    slot_duration : {
        type : Number , // In minutes
        default : 15
    } ,
    doctor : {
        type : mongoose.Schema.ObjectId ,
        ref : "Doctor" ,
        required : [true , "Doctor is must for making appointments !"]
    }
} , {
    timestamps : true
})

availability_schema.index({
    doctor : 1,
    date: 1
})

const Availability = mongoose.model("Availability" , availability_schema)

module.exports = Availability