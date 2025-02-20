const mongoose =require("mongoose");
const express=require("express");
const session=require("express-session")
const mongoDbsession=require("connect-mongodb-session")(session);

//constants
const app=express();
const store=new mongoDbsession({
    uri:"mongodb+srv://yokasdenis:yokas123@cluster012.nehxw.mongodb.net/todoDb",
    collection:"sessions",
});

//file-imports
const rateLimiting=require("./middleware/rateLimiting")

//middleware
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(
    session({
        secret:"This is my secret key to database session storage",
        resave:false,
        saveUninitialized:false,
        store:store,
    })
);



//db connection
mongoose
    .connect("mongodb+srv://yokasdenis:yokas123@cluster012.nehxw.mongodb.net/todoDb")
    .then(()=>{
        console.log("MongoDb connected successfully");
    })
    .catch((err)=>{
        console.log(err)
    });


//apis
app.get("/",rateLimiting,(req,res)=>{
    return res.send("login")
})

app.listen(8000,()=>{
    console.log("server running");
})