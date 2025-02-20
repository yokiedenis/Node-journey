const express=require("express")
const app=express();
app.get("/",(req,res)=>{{
    return res.send("page runing")
}})

//app for time
app.get("/time",(req,res)=>{
    const currentTime=new Date().toISOString();
    res.json({currentTime});
})

app.listen(8000,()=>{
    console.log("server is running")
})