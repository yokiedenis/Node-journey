// const isTest=require("./test")
// isTest();


//middleware
const {urlencoded}=require("body-parser")



const {isTest,isAuth}=require("./test")
isAuth();
isTest();
const express=require("express")
const app=express();
app.use(express.urlencoded({extended:true}));
app.get("/",(req,res)=>{
    return res.send("server is running")
})

//quuerys
app.get("/api",(req,res)=>{
    console.log(req.url," ",req.method);
    console.log(req.query);
    console.log(req.query.key.split(","));
    
    return res.send(`Query value: ${req.query}`)
    
})
app.get("/api1",(req,res)=>{
const key1=req.query.key1;
const key2=req.query.key2;
return res.send(`key1: ${key1} & key2=${key2}`);
})
//params
app.get("/profile/:id",(req,res)=>{
    console.log(req.params);
    return res.send(`params value: ${req.params.name}`)
    
})
app.get("/profile1/:id1/:id2",(req,res)=>{
    console.log(req.params);
    return res.send("param value")
})
app.get("/profile/:id/data",(req,res)=>{
    console.log(req.params);
    return res.send(`params value: ${req.params.name}`)
    
})

app.get("/getform",(req,res)=>{
    return res.send(`
        <html lang="en">
        <body>
            <h1>User Form</h1>
            <form action='/form_submit' method='POST'>
            <label for="name">Name</label>
            <input type="text" name="name"/>
            <br/>
            <label for="email">Email</label>
            <input type="text" name="email"/>
            <br/>
            <label for="password">Password</label>
            <input type="password" name="password"/>
            <br/>
            <button type="submit">Submit</button>
        </form>
        </body>
        </html>`);
})
app.post("/form_submit",(req,res)=>{
    console.log(req.body);
    return res.send("form submitted successfully")
})
app.listen(8000,()=>{
    console.log("server is running on port 8000");
})