import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcrypt';
import {nanoid} from 'nanoid';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import admin from 'firebase-admin';
import serviceAccountKey from './mern-blogging-project-firebase-adminsdk-kwt5d-3bfbf2eb59.json' assert {type: "json"};
import {getAuth} from 'firebase-admin/auth';


// Schema below
import User from './Schema/User.js';

const server = express();
let PORT = 3000;

// Using firebase admin SDK for authentication
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey)
});

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email 
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

server.use(express.json());

// backend -> 3000 and frontend -> 5172 are on different domains and port numbers
server.use(cors());

mongoose.connect(process.env.DB_LOCATION, {
    autoIndex: true,
})
.then(() => {
    console.log("Connected to database");
})
.catch((err) => {
    console.log("Error occured while connecting to database: " + err.message);
});

// format to send to frontend
const formatDatatoSend = (user) => {

    // Access token is generated using jwt and send to frontend for authentication
    const access_token = jwt.sign({id: user._id}, process.env.SECRET_ACCESS_KEY);

    return {
        access_token,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname,
    }
}

// Generate Unique username
// shik@gmail.com and shik@yahoo.com has same username -> shik
const generateUsername = async(email) => {
    // username is the email before the @
    let username = email.split("@")[0];
    let isUsernameNotUnique = await User.exists({
        "personal_info.username": username
    });

    isUsernameNotUnique ? username += nanoid().substring(0,5) : "";
    return username;
}
    

server.post("/signup", (req, res) => {  
    let {fullname, email, password} = req.body;
    
    // validating the data from frontend
    if(fullname.length < 3) {
        return res.status(403).json({
            "error": "Fullname must be at least 3 characters long"
        });
    }
    if(!email.length) {
        return res.status(403).json({
            "error": "Email must be entered"
        });
    }
    if(!emailRegex.test(email)) {
        return res.status(403).json({
            "error": "Invalid email"
        });
    }
    if(!passwordRegex.test(password)) {
        return res.status(403).json({
            "error": "Password must contain 6 to 20 characters long, contain at least 1 uppercase letter, 1 lowercase letter, and 1 number"
        });
    }

    // To hash the password
    bcrypt.hash(password, 10, async(err, hashedPassword) => {
        let username = await generateUsername(email);
        let user = new User( {
            personal_info: { fullname, email, password: hashedPassword, username}
        })

        user.save()
        .then((u)=> {
            return res.status(200).json(formatDatatoSend(u))
        })
        .catch((err) => {

            if(err.code === 11000) {
                return res.status(500).json({
                    "error": "Email already exists"
                });
            }
                return res.status(500).json({
                    "error": err.message
                });
            });
        console.log(hashedPassword);
    });
});

server.post("/signin", (req, res) => {
    let {email, password} = req.body;

    // finding the user with the email
    User.findOne({ "personal_info.email": email })
    .then((user) => {
        if(!user) {
            return res.status(403).json({ "error": "Email not found" });
        }

        // comparing the password
        bcrypt.compare(password, user.personal_info.password , (err, result) => {
            if(err) {
                return res.status(403).json({"error": "Error occured while login try again"});
            }

            if(!result) {
                return res.status(403).json({"error": "Incorrect Password"});
            }
            else {
                return res.status(200).json(formatDatatoSend(user));
            }
        });
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({ "error": err.message });
    })
})

server.post("/google-auth", async(req, res) => {
    // Google Access token is sent from frontend for verification
    // after verification it store the user in db and hence async is used
    let { access_token } = req.body;

    getAuth()
    .verifyIdToken(access_token)
    .then(async (decodedUser) => {
        let {email, name, picture} = decodedUser;

        // replace the low resolution image with high resolution image
        picture = picture.replace("s96-c", "s384-c");

        // check if the user already exists
        let user = await User.findOne({"personal_info.email": email}).select("personal_info.fullname personal_info.username personal_info.profile_img google_auth")
        .then((u) => {
            return u || null;
        })
        .catch((err) => {
            return res.status(500).json({ "error": err.message });
        });

        // if user exist then send error message
        if(user) { // login
            if(!user.google_auth) {
                return res.status(403).json({"error": "This email was signed up without google. Please log in with password to access the account"});
            }
        }
        else { // sign up
            let username = await generateUsername(email);

            // data its get from google
            user = new User({
                personal_info: {
                    fullname: name,
                    email,
                    profile_img: picture,
                    username
                },
                google_auth: true
            });
            
            await user.save().then((u) => {
                // because we have to again check if the user is saved or not or user is null or not

                // here it directly make saved DB data to user
                user = u;
            })
            .catch((err) => {
                return res.status(500).json({ "error": err.message });
            })

        }

        return res.status(200).json(formatDatatoSend(user));

    })
    .catch((err) => {
        return res.status(500).json({ "error": "Failed to authenticate you with google. Try with some other google account" });
    })
})

server.listen(PORT, () => {
    console.log('Listeniing on port: ' + PORT);
});