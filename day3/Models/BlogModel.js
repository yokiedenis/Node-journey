const BlogSchema=require("../Schemas/BlogSchema")
const {LIMIT}=require("../privateConstants")
const ObjectId=require("mongodb").ObjectId;

const createBlog=({title,textBody,userId,creationDateTime})=>{
    return new Promise(async(resolve,reject)=>{
        const blogObj=new BlogSchema({
            title,
            textBody,
            creationDateTime,
            userId,
        });
        try{
            const blogDb=await blogObj.save();
            resolve(blogDb);
        }catch(error){
            reject(error);
        }
    });
};

const getAllBlogs=({SKIP})=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const blogDb=await BlogSchema.aggregate([
            {
                $sort:{creationDateTime:-1},//DESCEND
            },
            {
                $facet:{
                    data:[{$skip:SKIP},{$limit:LIMIT}],
                },
            },
        ]);
        resolve(blogDb[0].data);
        }catch(error){
            reject(error);
        }
    });
};

const getMyBlogs=({SKIP,userId})=>{
    return new Promise(async(resolve,reject)=>{
        //pagination, sort, match
        try{
            const myBlogsDb=await BlogSchema.aggregate([
                {
                    $match:{userId:userId},
                },
                {
                    $sort:{creationDateTime:-1},
                },
                {
                    $facet:{
                        data:[{$skip:SKIP},{$limit:LIMIT}],
                    },
                },
            ]);
            resolve(myBlogsDb[0].data);
        }catch(error){
            reject(error);
        }
    });
};

const getBlogWithId=({blogId})=>{
    return new Promise(async(resolve,reject)=>{
        try{
            if(!ObjectId.isValid(blogId)) reject("Invalid blogId format");
            
            const blogDb=await BlogSchema.findOne({_id:blogId});//new ObjectId(blogId)

            if(!blogDb) reject(`No blog found with blogId: ${blogId}`);

            resolve(blogDb)
        }catch(error){
            reject(error);
        }
    });
};

const updateBlog=({title,textBody,blogId})=>{
    return new Promise(async(resolve,reject)=>{
        let newBlogData={};
        newBlogData.title=title;
        newBlogData.textBody=textBody;

        try{
            const blogPrev=await BlogSchema.findOneAndUpdate(
                {_id:blogId},
                newBlogData
            );
            resolve(blogPrev);
        }catch(error){
            reject(error);
        }
    });
};

const deleteBlog=({blogId})=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const prevBlogDb=await BlogSchema.findOneAndDelete({_id:blogId});
            resolve(prevBlogDb);
        }catch(error){
            reject(error);
        }
    });
};


module.exports={
    createBlog,
    getAllBlogs,
    getBlogWithId, 
    getMyBlogs,
    updateBlog,
    deleteBlog,
};