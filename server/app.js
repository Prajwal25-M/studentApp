const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose =  require('mongoose')



require('./Student')

app.use(bodyParser.json())

const Student = mongoose.model("student")

const mongoUri ="mongodb+srv://cnq:bsBC6k9XwX2YWcVC@cluster0.0kgcq.mongodb.net/<dbname>?retryWrites=true&w=majority"

mongoose.connect(mongoUri,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})


mongoose.connection.on("connected",()=>{
    console.log("connected to mongo yeahhh")
})
mongoose.connection.on("error",(err)=>{
    console.log("error",err)
})



app.get('/',(req,res)=>{
    Student.find({}).then(data=>{
        res.send(data)
    }).catch(err=>{
        console.log(err)
    })
    
})

app.post('/send-data',(req,res)=>{
    const student =new Student({
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        picture:req.body.picture,
        USN:req.body.USN,
        semester:req.body.semester
    })
    student.save()
    .then(data=>{
        console.log(data)
        res.send(data)
    }).catch(err=>{
        console.log(err)
    })
    
})

app.post('/delete',(req,res) =>{
    Student.findByIdAndRemove(req.body.id)
    .then(data=>{
        console.log(data)
        res.send(data)
    })
    .catch(err=>{
        console.log(err)
    })
})

app.post('/update',(req,res)=>{
    Student.findByIdAndUpdate(req.body.id,{
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        picture:req.body.picture,
        USN:req.body.USN,
        semester:req.body.semester
    }).then(data=>{
        console.log(data)
        res.send(data)
    })
    .catch(err=>{
        console.log(err)
    })
})

app.listen(3000,()=>{
    console.log("server running")
})



