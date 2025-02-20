const express = require("express")
const mongoose = require("mongoose")
//file imports
const userModel = require("./models/userModel")
// constants
const app = express();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json())


//db connect
mongoose
    .connect("mongodb+srv://yokasdenis:yokas123@cluster012.nehxw.mongodb.net/testDayDB")
    .then(() => {
        console.log("mongodb connected");
    })
    .catch((err) => {
        console.log(err);
    })

app.get("/", (req, res) => {
    return res.send("homepage")
})



app.get("/register", (req, res) => {
    return res.send(`
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <form action="/register" method="post">
        <input type="text" name="username" placeholder="username">
        <input type="password" name="password" placeholder="password">
        <button type="submit">register</button>
    </form>
</body>
</html>`)
})


app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const userObj = new userModel({
        username: username,
        password: password,
    })
    try {
        const userDb = await userObj.save();
        return res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <form action="/login" method="post">
        <input type="text" name="username" placeholder="username">
        <input type="password" name="password" placeholder="password">
        <button type="submit">login</button>
    </form>
</body>
</html>`)
    } catch (err) {
        return res.send({
            status: 500,
            message: "db err",
            error: err,
        })
    }
})




app.get("/login", (req, res) => {
    return res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <form action="/login" method="post">
        <input type="text" name="username" placeholder="username">
        <input type="password" name="password" placeholder="password">
        <button type="submit">login</button>
    </form>
</body>
</html>`)
})


app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        let userDb = await userModel.findOne({ username: username });
        if (userDb.password !== password) {
            return res.send({
                status: 400,
                message: "password doesnot match"
            })
        }
        return res.redirect("/dashboard")
    } catch (err) {
        return res.send({
            status: 500,
            message: "DB err",
            error: err,
        })
    }
})


app.get("/dashboard", (req, res) => {
    return res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
   <h1>dashboard</h1>
</body>
</html>`)
})


app.listen(8000, () => {
    console.log("server is running")
})