const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")

const doctor_schema = new mongoose.Schema({
    name : {
        type : String ,
        trim : true ,
        required : [true , "Name is must !"]
    } ,
    email : {
        type : String ,
        trim : true ,
        lowercase : true ,
        validate : [validator.isEmail , "Invalid Email !"] ,
        unique : true ,
        required : [true , "Email is must !"]
    } ,
    speciality : {
        type : String ,
        trim : true 
    } ,
    password : {
            type : String ,
            trim : true ,
            required : [true , "Password is must !"] ,
            minlength : 3 ,
            select : false
        } ,
    confirm_password : {
            type : String ,
            trim : true , 
            required : [true , "Confirm Password is must !"] ,
            validate : {
                validator : function(el) {
                    return (el === this.password)
                } ,
                message : "Confirm password must be same as original password !"
            }
        }
} , {
    timestamps : true
})

doctor_schema.pre("save" , async function(next) {
    if (!this.isModified("password"))
        return

    this.password = await bcrypt.hash(this.password , 12)
    this.confirm_password = undefined 
})

const Doctor = mongoose.model("Doctor" , doctor_schema)

module.exports = Doctor