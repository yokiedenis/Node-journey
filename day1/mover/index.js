const express =require("express");
const app =express();
app.get("/",(req,res)=>{
    console.log(req);
    return res.send("server is running")
})
app.listen(8000,()=>{
    console.log("server is running at port 8000")
})
// console.log("this is my console");
