const accessModel =require("../models/accessModel");

const rateLimiting=async(req,res,next)=>{
    const sessionId=req.session.id;


    try{
        const accessDb =await accessModel.findOne({sessionId:sessionId});

        const diff=(Date.now()-accessDb.time)/1000;

        if(diff < 5){
            return res.send({
                status:400,
                message:"Too many requests, please wait for some time.",
            })
        }
        await accessModel.findOneAndUpdate({sessionId},{time:Date.now()});
        next();
    }catch(error){
        return res.send({
                status:500,
                message:"Database error, via ratelimiting",
                error:error,
            });
        }
    };

    module.exports=rateLimiting;
