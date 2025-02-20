const AccessSchema = require("../Schemas/AccessSchema");
const Accessschema =require("../Schemas/AccessSchema");

const rateLimiting=async(req,res,next)=>{
    const sid=req.session.id;
    //find if the access entry with sid

    try{
        const acccessDb=await AccessSchema.findOne({sessionId:sid});
        //if null, create an entry in DB : R1
        if(!accessDb){
            const accessObj=new AccessSchema({
                sessionId:sid,
                time:Date.now(),
            });

            await accessObj.save();
            next();
            return;
        }
        //R2--Rnth

        const diff=Date.now()-accessDb.time;
        //1 hit per second
        if(diff<5000){
            return res.send({
                status:400,
                message:"Too many request, please wait for sometime",
            });
        }
        await AccessSchema.findOneAndUpdate(
            {sessionId:sid},
            {time:Date.now()}
        );
        next();
    }catch(error){
        return res.send({
            status:500,
            error:error,
        });
    }
};

module.exports=rateLimiting;