import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcrypt';

const server = express();
let PORT = 3000;

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

server.use(express.json());

mongoose.connect(process.env.DB_LOCATION, {
    autoIndex: true,
});

server.post("/signup", (req, res) => {  
    let {fullname, email, password} = req.body;
    
    // validating the data from frontend
    if(fullname.length < 3) {
        return res.status(403).json({
            "error": "Fullname must be at least 3 characters long"
        })
    }
    if(!email.length) {
        return res.status(403).json({
            "error": "Email must be entered"
        })
    }
    if(!emailRegex.test(email)) {
        return res.status(403).json({
            "error": "Invalid email"
        })
    }
    if(!passwordRegex.test(password)) {
        return res.status(403).json({
            "error": "Password must contain 6 to 20 characters long, contain at least 1 uppercase letter, 1 lowercase letter, and 1 number"
        })
    }

    // To hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        // username is the email before the @
        let username = email.split("@")[0]; 
        
        console.log(hashedPassword);
    });

    return res.status(200).json({
        "status": "okay",
    });
});

server.listen(PORT, () => {
    console.log('Listeniing on port: ' + PORT);
})