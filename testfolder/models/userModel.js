const mongoose=require("mongoose");
const { type } = require("os");
const Schema=mongoose.Schema;

const userSchema=new Schema({
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    }
})

module.exports=mongoose.model("userModel",userSchema);