const express =require("express");
require("dotenv").config();
const session =require("express-session");
const mongoDbsession=require("connect-mongodb-session")(session);


//file imports
const db =require("./db")
const AuthRouter=require("./Controllers/AuthController")
const {isAuth}=require("./Middlewares/AuthMiddleware")
const BlogRouter=require("./Controllers/BlogController")
const followRouter=require("./Controllers/FollowController");
const cleanUpBin=require("./cron");

//constants
const app=express();
const PORT=process.env.PORT;
const store=new mongoDbsession({
    uri:process.env.MONGO_URI,
    collection:"sessions",
})

//middleware
app.use(express.json());
app.use(
    session({
        secret:process.env.SECRET_KEY,
        resave:false,
        saveUninitialized:false,
        store:store,
    })
)

app.get("/",(req,res)=>{
    return res.send({
        status:200,
        message:"BlogServer is running",
    })
})

//__/auth/register POST
app.use("/auth",AuthRouter);
// /blog/create-blog POST
app.use("/blog",isAuth,BlogRouter);
app.use("/follow",isAuth,followRouter)

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
    cleanUpBin();
})