const mongoose=require("mongoose");

//Db connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("MongoDb is connected sucessfully");
    })
    .catch((err)=>{
        console.log(err); 
    })