
import mongoose from "mongoose";



const workSchema = mongoose.Schema({

    workname: {
        type: String,
    },
    days: {
        type: Number,
    },
    city: {
        type: String,
    },
     email: {
        type: String,
        required : true,
    },
    longitude :{
        type: Number,
    },
    latitude:{
        type: Number,
    },
    mobileno:{
        type: Number,
    },
    desc:{
        type: String,
    },
    worker:{
        type: Number,
    },
    date: {
        type: Date
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date


})

const work = mongoose.model('work' , workSchema )
export default work;