console.log("welocme to my first server") 
const express =require("express")
const app=express();
app.get("/",(req,res)=>{
    console.log("ap is workingnpm ");

    return res.send("server is running")
})
app.listen(8000,()=>{
    console.log("server is running on PORT:8000");
})