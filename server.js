const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')


require('dotenv').config()

const app = express()

app.use(express.json())

app.use(cors())

const PORT = process.env.PORT || 3000


async function startServer() {
    try{

        if(!process.env.MONGODB_URI) {
            console.log(process.env.MONGODB_URI)
            throw new Error('Mongodb Url is missing!!')
        }

       await mongoose.connect(process.env.MONGODB_URI)
        console.log('Mongodb is connected')

        app.listen(PORT,() =>{
            console.log(`The Port is running on ${PORT}`)
        })

    }
    catch(err) {
        console.log(err.message)
    }
}

startServer()


const form = mongoose.Schema({
    personaldetails:{
        firstname:{
            type:String,
            required:[true,"First Name is required field"],
            trim:true,
            minlength:[3,"Name should be atleast 3 charactors"]
        },
        middlename:{
            type:String,
            default:" "
        },
        lastname:{
            type:String,
            required:[true,"Last Name is required Field"],
            trim:true,
            minlength:[3,"Name should be atleast 3 charactors"]
        },
        DOB:{
            type:Number,
            required:[true,"DOB is required"],
            trim:true
        },
        contact:{
            type:Number,
            required:[true,"Contact is required"],
            trim:true
        },
        email:{
            type:String,
            required:[true,"Email is required"],
            trim:true
        }
    },
    Addressdetails:{
        CurrentAddress:{
            addressLine1:{
                type:String,
                required:[true,"Address is required field"]
            },
            addressLine2:{
                type:String,
                default:""
            },
            state:{
                type:String,
                required:[true,"State is required field"],
                trim:true
            },
            zipcode:{
                type:Number,
                required:[true,"State is required field"],
                trim:true
            }
        },
        PermanentAddress:{
            addressLine1:{
                type:String,
                required:[true,"Address is required field"]
            },
            addressLine2:{
                type:String,
                default:""
            },
            state:{
                type:String,
                required:[true,"State is required field"],
                trim:true
            },
            zipcode:{
                type:Number,
                required:[true,"State is required field"],
                trim:true
            }
        }
    },
    checkbox:{
        type:Boolean,
        defaule:false
    },
    EducationDetails:{
        type:[
            {
                qualification:{
                    type:String,
                    required:[true,"Qualification is required field"]
                },
                university:{
                    type:String,
                    required:[true,"University is required field"]
                },
                passingyear:{
                    type:Number,
                    required:[true,"Passing Year is required field"]
                },
                percentage:{
                    type:Number,
                    required:[true,"Percentage is required"]
                }
            }
        ],
        required:[true,"Education is required field"],
        validate:{
            validator:function(value) {
                return value.length >0;
            },
            message:"At least one eduction record is required"
        }
    }
},
{
    timestamps:true
})


const formModel = mongoose.model("Form",form)


app.post('/api/students',async(req,res)=>{
    
    try{
        let details = req.body

    let Obj = await formModel.create(details)

    res.status(201).json({
        message:"New Student Is Added",
        Student:Obj
    })
    }
    catch(err){

        if(err.name ==='ValidationError'){
            res.status(400).json({
                message:"Validation Error",
                error:err.message
            })
        }

        res.status(500).json({
            message:"Internal Server Error",
            error:err
        })
    }
})


app.get('/api/students',async(req,res) =>{
    try{
         let data = await formModel.find();

        res.status(200).json({
            message:"Student Details fetched!!",
            students:data
        })
    }
    catch(err){
        
        res.status(500).json({
            message:"Internal Server Error",
            error:err
        })
    }
   
})


app.get("/api/students/:id",async(req,res) =>{
    try{
        let {id} = req.params.id

        let student = await formModel.findOne({_id:id})

        if(!student){
          return  res.status(404).json({
                message:"Student not found!!",
            })
        }

        res.status(200).json({
            message:"Student data fetched",
            student:student
        })

    }
    catch(err) {
        if(err.name==="CastError"){
            res.status(400).json({
                message:"Invalid request",
                error:err.message
            })
        }
    }
})


app.put("/api/students/:id",async(req,res)=>{
    try{
        let id = req.params.id

        let body = req.body

        let student = await formModel.findOneAndUpdate({_id:id},body,{returnDocument: 'after'})

        if(!student){
           return res.status(404).json({
                message:"Student OBJ is not found"
            })
        }

        res.status(201).json({
            message:"Student details is updated successfully!!",
            student:student
        })

    }
    catch(err){
        if(err.name === "ValidationError"){
            return  res.status(400).json({
                message:"Validation Error",
                error:err.message
            })
        }else if(err.name==="CastError"){
            res.status(400).json({
                message:"Invalid request",
                error:err.message
            })
        }


        res.status(500).json({
            message:"Internal Server Error",
            error:err
        })

    }
})


app.delete("/api/students/:id",async(req,res)=>{
    try{
        let id = req.params.id

        let student = await formModel.findByIdAndDelete({_id:id})

        if(!student){
            return res.status(404).json({
                message:"Student not found",
                
            })
        }

        res.status(200).json({
            message:"Student Record is removed!!",
            student :student
        })

    }
    catch(err){
        if(err.name==="CastError"){
            res.status(400).json({
                message:"Invalid request",
                error:err.message
            })
        }


        res.status(500).json({
            message:"Internal server error",
            error:err
        })


    }
})

