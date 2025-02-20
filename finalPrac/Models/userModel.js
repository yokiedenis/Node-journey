const mongoose=require("mongoose")
const Schema=mongoose.Schema;

const userModel=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
    }
})

module.exports=mongoose.model("userModel",userModel);