const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const mongoSanitize = require('express-mongo-sanitize');

const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const DOMPurify = require('dompurify')(window);

mongoose.connect(process.env.MONGO_URL);

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

// app.use(
//     mongoSanitize({
//       onSanitize: ({ req, key }) => {
//         console.warn(`This request[${key}] is sanitized`);
//       },
//     }),
//   );


// app.use((req, res, next) => {
//   // Sanitize request body (assuming it's JSON)
//   if (req.body) {
//     req.body = sanitizeInput(req.body);
//   }

//   // Continue to the next middleware or route handler
//   next();
// });


  const sanitizeInput = (data) => {
    if (typeof data === 'object') {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          data[key] = sanitizeInput(data[key]);
        }
      }
    } else if (typeof data === 'string') {
      return DOMPurify.sanitize(data);
    }
  
    return data;
  }
  



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
        resp.status(500).json({err: e.message});
    }
});

app.post("/login", async (req, resp) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email: email, password:password}).exec();

        if (user === null) {
            return resp.status(401).json({err: "Invalid email or password"});
        }

        // generate session token
        const token = jwt.sign({_id: user._id}, "thisIsASecretKey");

        delete user.password;
        return resp.json({...user._doc, token: `Bearer ${token}`});
    } catch (e) {
        return resp.status(500).json({err: e.message});
    }
});

app.get("/user", async (req, resp) => {
    try {
        const token = req.header('auth-token');
        const decoded = jwt.verify(token, "thisIsASecretKey");
        const user = await User.findOne({_id: decoded._id}).exec();

        if (user === null) {
            resp.status(404).josn({err: "User not found"});
        }

        delete user.password;
        return resp.json(user);
    } catch (e) {
        resp.status(500).json({err: e.message});
    }
});

app.get("/users", async (req, resp) => {
    try {
        const token = req.header('auth-token');
        jwt.verify(token, "thisIsASecretKey");
        const users = await User.find({}).exec();
        return resp.json(users);
    } catch (e) {
        resp.status(500).json({err: e.message});
    }
});

app.delete("/deleteUser", async (req, resp) => {

    try {
        const token = req.header('auth-token');
        jwt.verify(token, "thisIsASecretKey");
        await User.deleteOne({_id: req.body.id}).exec();
        await Image.deleteMany({user: req.body.id}).exec();
        resp.status(200).send({result: "success"});
    } catch (e) {
        resp.status(500).send({err: e.message});
    }
    
});

app.post("/create", async (req, resp) => {
    try {
        const image = new Image(req.body);
        let result = await image.save();
        result = result.toObject();
        resp.status(201).send(req.body);
 
    } catch (e) {
        resp.status(500).send({err: e.message});
    }
});


app.post("/images", async (req, resp) => {
    try {
        const posts = await Image.find({user: req.body._id}).exec();
        return resp.json(posts);
    } catch (e) {
        resp.status(500).send({err: e.message});
    }
});

app.listen(5000);