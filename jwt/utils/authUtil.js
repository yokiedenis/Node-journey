const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");


const generateJWTToken = (email) => {
    const token = jwt.sign(email, "this is my secret key");
    return token;
};


const sendVerificationEmail = (email, verifiedToken) => {
    //transporter
     const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            service: "gmail",
            auth: {
                user: "yokasdenis@gmail.com",
                pass: "cdin napn jenw aaxu",
            }
        });
    
    //mail options
    const mailOptions = {
        from: "yokasdenis@gmail.com",
        to: email,
        subject: "Email verification for TODO APP",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Todo App</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  </head>
  <body>
    <a href="http://localhost:8003/verifytoken/${verifiedToken}">Activate Account</a>
  </body>
  </html>
        `
    };

    //send mail
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.log(err);
        else
            console.log(
                `Email has been sent successfully: ${email}` + info.response
            );
    });
};


module.exports = { generateJWTToken, sendVerificationEmail };