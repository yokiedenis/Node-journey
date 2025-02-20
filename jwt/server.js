const express = require("express")
const mongoose = require("mongoose");
const app = express();
const jwt = require("jsonwebtoken");

//file imports
const userModel = require("./Schema/userModel");
const {
    generateJWTToken,
    sendVerificationEmail,
} = require("./utils/authUtil");

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs")


//db connection
mongoose
    .connect("mongodb+srv://yokasdenis:yokas123@cluster012.nehxw.mongodb.net/test21Db")
    .then(() => {
        console.log("MongoDb connected")
    })
    .catch((err) => {
        console.log(err)
    });



//APIs
app.get("/", (req, res) => {
    return res.send("running")
})


app.get("/register", (req, res) => {
    return res.render("register")
})

app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    /*check if email and username already exist or not
    const userEmailExist = await userModel.findOne({ email });
    if (userEmailExist) {
        return res.send({
            status: 400,
            message: "Email already exist",
        })
    }*/

    const userObj = new userModel({
        username: username,
        email: email,
        password: password,
    })

    try {
        const userDb = await userObj.save();
        //generate a token
        const verifiedToken = generateJWTToken(email);

        //send a mail to user
        sendVerificationEmail(email, verifiedToken)
        return res.render("login")
    } catch (err) {
        return res.send({
            status: 500,
            message: "Database error",
            error: err,
        });
    }

})


app.get("/verifytoken/:token", async (req, res) => {
    const token = req.params.token;
    const userEmail = jwt.verify(token, `this is my secret key`);
    try {
        await userModel.findOneAndUpdate(
            { email: userEmail },
            { isEmailAuthenticated: true }
        );
        return res.redirect("/login");
    } catch (error) {
        return res.send({
            status: 500,
            message: "Database error",
            error: error,
        });
    }
});



app.get("/login", (req, res) => {
    return res.render("login")
})

app.post("/login", async (req, res) => {
    const { loginId, password } = req.body;

    try {
        let userDb;
        if (loginId.includes("@")) {
            userDb = await userModel.findOne({ email: loginId })
        } else {
            userDb = await userModel.findOne({ username: loginId })
        }

        if (!userDb) {
            return res.send({
                status: 400,
                message: "User not found, please register",
            });
        }

        //   comparing password in Database with input one
        if (password !== userDb.password) {
            return res.send({
                status: 400,
                message: "Password incorrect",
            });
        }

        //if email is authenticated
        if (!userDb.isEmailAuthenticated) {
            return res.send({
                status: 400,
                message: "Please verify your email before login, check email app"
            })
        }

        return res.redirect("dashboard");
    } catch (err) {
        return res.send({
            status: 500,
            message: "Database error",
            error: err,
        });
    }
})


app.get("/dashboard", (req, res) => {
    return res.render("dashboard")
})


app.listen(8003, () => {
    console.log("server is running");

})