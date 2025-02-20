const express = require("express");
const session =require("express-session")
require("dotenv").config()
const mongoose=require("mongoose");
const { urlencoded } = require("body-parser");
const mongoDbsession=require("connect-mongodb-session")(session)


//constants
const app=express();
const PORT=process.env.PORT;
const store= new mongoDbsession({
    uri:process.env.MONGO_URI,
    collection:"sessions"
})

//middleware
app.use(express.json())
app.set("view engine","ejs")
app.use(express.urlencoded({extended:true}))
app.use(
    session({
        secret:process.env.MONGO_URI,
        resave:false,
        saveUninitialized:false,
        store:store,
    })
)
const isAuth =(req,res,next)=>{
    if(req.session.isAuth){
        next();
    }else{
        return res.status(401).json("Session expired, please login again")
    }
}

//connect db
mongoose
    .connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("MongoDb connected")
    })
    .catch((err)=>{
        console.log(err)
    })



app.get("/",(req,res)=>{
    return res.send("running")
})
app.listen(PORT,()=>{
    console.log("server running")
})
