const LIMIT = 5; 

const getMyBlogs = ({ SKIP}) => {
  return new Promise(async (resolve, reject) => {
    //pagination 
    try {
      const myBlogsDb = await BlogSchema.aggregate([
        {
          $facet: {
            data: [{ $skip: SKIP }, { $limit: LIMIT }],
          },
        },
      ]);
      resolve(myBlogsDb[0].data);
    } catch (error) {
      reject(error);
    }
  });
};

// /my-blogs?skip=5
BlogRouter.get("/my-blogs", async (req, res) => {
  const SKIP = parseInt(req.query.skip) || 0;
  try {
    const myBlogsDb = await getMyBlogs({ SKIP});
    if (myBlogsDb.length === 0) {
      return res.send({
        status: 400,
        message: "No more Blogs",
      });
    }
    return res.send({
      status: 200,
      message: "Read success",
      data: myBlogsDb,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});
