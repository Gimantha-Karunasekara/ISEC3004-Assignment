const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const jwt = require('jsonwebtoken');
mongoose.connect('mongodb+srv://gimantha2003:tx69kuZgdNx40SOO@cluster0.nx75kk0.mongodb.net/ISEC3004?retryWrites=true&w=majority');
 


const ImageSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
});

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }
});

const Image = mongoose.model('images', ImageSchema);
const User = mongoose.model('users', UserSchema);
Image.createIndexes();
 
// For backend and express
const express = require('express');
const app = express();
const cors = require("cors");
console.log("Backend listen at port 5000");
app.use(express.json());
app.use(cors());

app.use(
    mongoSanitize({
      onSanitize: ({ req, key }) => {
        console.warn(`This request[${key}] is sanitized`);
      },
    }),
  );

app.get("/", (req, resp) => {
    let dbStatus = false;
    if (mongoose.connection.readyState === 1) {
        dbStatus = true;
    }
    const status = {backend: true , db: dbStatus};
    resp.json(status);
    
});

app.post("/signup", async (req, resp) => {
    try {
        const data = req.body;
        data.isAdmin = false;
        const user = new User(data);
        let result = await user.save();
        delete result.password;
        const token = jwt.sign({_id: result._id}, "thisIsASecretKey");
        return resp.status(201).json({...result, token: `Bearer ${token}`});
 
    } catch (e) {
        console.log(e);
        resp.status(400).json({err: "Error occurred"});
    }
});

app.post("/login", async (req, resp) => {
    const {email, password} = req.body;
    console.log("response :",req.body);
    try {
        const user = await User.findOne({email: email, password:password}).exec();

        if (user === null) {
            throw new Error("Invalid email or password");
        }

        // generate session token
        const token = jwt.sign({_id: user._id}, "thisIsASecretKey");

        delete user.password;
        return resp.json({...user._doc, token: `Bearer ${token}`});
    } catch (e) {
        console.log(e);
        resp.status(400).json({err: "Invalid email or password"});
    }
});

app.get("/user", async (req, resp) => {
    try {
        const token = req.header('auth-token');
        const decoded = jwt.verify(token, "thisIsASecretKey");
        const user = await User.findOne({_id: decoded._id}).exec();
        delete user.password;
        return resp.json(user);
    } catch (e) {
        console.log(e);
        resp.status(400).json({err: "Invalid email or password"});
    }
});

app.get("/users", async (req, resp) => {
    try {
        const token = req.header('auth-token');
        jwt.verify(token, "thisIsASecretKey");
        const users = await User.find({}).exec();
        return resp.json(users);
    } catch (e) {
        console.log(e);
        resp.status(400).json({err: "Invalid email or password"});
    }
});

app.delete("/deleteUser", async (req, resp) => {

    try {
        const token = req.header('auth-token');
        jwt.verify(token, "thisIsASecretKey");
        await User.deleteOne({_id: req.body.id}).exec();
        await Image.deleteMany({user: req.body.id}).exec();
        resp.status(200).send({result: "success"});
    } catch (error) {
        resp.status(500).send(error);
        console.log(error); 
    }
    
});




app.post("/create", async (req, resp) => {
    try {
        const image = new Image(req.body);
        let result = await image.save();
        result = result.toObject();
        resp.send(req.body);
        console.log(result);
 
    } catch (e) {
        console.log(e);
        resp.send("Something Went Wrong");
    }
});


app.post("/images", async (req, resp) => {

    try {
        const posts = await Image.find({user: req.body._id}).exec();
        return resp.json(posts);
    } catch (e) {
        console.log(e);
        resp.send("Something Went Wrong");
    }
});

app.listen(5000);