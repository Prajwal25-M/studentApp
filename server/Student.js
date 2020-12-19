const mongoose = require('mongoose')

const StudentSchema = new mongoose.Schema({
    name:String,
    email:String,
    phone:String,
    picture:String,
    USN:String,
    semester:String
})

mongoose.model("student",StudentSchema)