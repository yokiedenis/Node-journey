//import packages
const express=require("express");
const mongoose =require("mongoose");
const session=require("express-session")
const mongoDbsession=require("connect-mongodb-session")(session)
require("dotenv").config();

//file imports
const userModel=require("./Schemas/userModel");

//constant
const PORT=process.env.PORT;
const app=express();
const store = new mongoDbsession({
    uri: process.env.MONGO_URI,
    collection: "sessions",
  });

//middlewares
app.set("view engine","ejs")
//to allow transfer of data in json 
app.use(express.json());
app.use(express.urlencoded({extended:true}))
//for session
app.use(
    session({
      secret: process.env.SECRET_KEY,
      resave: false,
      saveUninitialized: false,
      store: store,
    })
  );
  //for checking if a session present
  const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
      next();
    } else {
      return res.status(401).json("Session expired, please login again");
    }
  };
  


//db connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("MongoDb connected")
    })
    .catch((err)=>{
        console.log(err)
    });

    //APIs
app.get("/",(req,res)=>{
    return res.send("running")
})
app.get("/register",(req,res)=>{
    //can render html directly instead of view engine
    return res.render("index")
})
app.get("/login",(req,res)=>{
    return res.render("login")
})
app.get("/dashboard", isAuth, (req, res) => {
    return res.render("dashboard");
  });
app.post("/register",async(req,res)=>{
    const{username,email,password}=req.body;
    const userObj =new userModel({
        username:username,
        email:email,
        password:password,
    }) 
    try{
        const userDb=await userObj.save();
        return res.redirect("/login")
    }catch(err){
        return res.send({
            status: 500,
            message: "Database error",
            error: err,
          });
    }

})
app.post("/login",async(req,res)=>{
    //data body being sent
const{loginId,password}=req.body;
try{
    let userDb;
    //accessing the database
    if(loginId.includes("@")){
        userDb=await userModel.findOne({email:loginId})
    }else{
        userDb=await userModel.findOne({username:loginId})
    }
    if (!userDb) {
        return res.send({
          status: 400,
          message: "User not found, please register",
        });
      }
      //comparing password in Database with input one
      if (password !== userDb.password) {
        return res.send({
          status: 400,
          message: "Password incorrect",
        });
      }
      //creating a session base auth in database
    req.session.isAuth = true;
    req.session.user = {
      userId: userDb._id,
      email: userDb.email,
      username: userDb.username,
    };
    return res.redirect("/dashboard");
}catch (err) {
    return res.send({
      status: 500,
      message: "Database error",
      error: err,
    });
  }
})
//to start server in web browser npm start
app.listen(PORT,()=>{
    console.log("server is running");
    
})