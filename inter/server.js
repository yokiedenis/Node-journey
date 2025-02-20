const express=require("express");
const mongoose =require("mongoose")
const session = require("express-session");
const send = require("send");
const mongoDbsession=require("connect-mongodb-session")(session)
require("dotenv").config();

//constants
const PORT=process.env.PORT;
const app=express();
const store=new mongoDbsession({
    uri:process.env.MONGO_URI,
    collections:"sessions",
})
const isAuth=(req,res,next)=>{
    if(req.session.isAuth){
        next();
    }else{
        return res.status(400).json("Session expired")
    }
}
//file imports
const userModel=require("./models/userModel")

//middleware
app.set("view engine","ejs")
app.use(express.json())
app.use(
    session({
        secret:process.env.SECRET_KEY,
        resave:false,
        saveUninitialized:false,
        store:store,
    })
)
//db connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("db connected successfully")
    }).catch((err)=>{
        console.log(err)
    })
//api
app.get("/",(req,res)=>{
    return res.send("running")
})
app.get("/register",(req,res)=>{
    return res.render("/register")
})
app.post("/register",async(req,res)=>{
    const{username,email,password}=req.body;
    const userObj=new userModel({
        username:username,
        email:email,
        password:password,
    })
    try{
        const userDb=await userObj.save();
        return res.redirect("/login");
    }catch(error){
     return res.send({
        status:500,
        message:"databse error",
        error:error,
     })
    }
})

app.get("/login",(req,res)=>{
    return res.render("/login")
})
app.post("/login",async,(req,res)=>{
    const{loginId,password}=req.body;
    try{
        let userDb;
        if(loginId.includes("@")){
            userDb=await userModel.findOne({email:loginId})
        }else{
            userDb=await userModel.findOne({username:loginId})
        }
        if(!userDb){
            return res.send({
                status:400,
                message:"user not present",
                error:error
            })
        }
        if(userDb.password!==password){
            return res.send({
                status:400,
                message:"wrong password",
                error:error,
            })
        }

        //creating session
        req.session.isAuth=true;
        re
    }
})

app.listen(PORT,()=>{
    console.log("server is running")
})