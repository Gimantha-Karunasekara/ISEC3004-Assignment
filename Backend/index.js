const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const jwt = require('jsonwebtoken');
mongoose.connect('mongodb+srv://gimantha2003:tx69kuZgdNx40SOO@cluster0.nx75kk0.mongodb.net/ISEC3004?retryWrites=true&w=majority');
 
// Schema for users of app
const images = [
    {
        name: "Post 1",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ac massa ultricies, hendrerit nisl ultrices, laoreet orci. Sed placerat, mauris sit amet vestibulum dapibus, erat arcu posuere ex, quis egestas enim turpis nec tortor. Nullam sit amet lacinia eros.",
        user: "Gimantha",
        img: "https://images.unsplash.com/photo-1682687982183-c2937a74257c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2942&q=80"
    },
    {
        name: "Post 2",
        desc: "This is a test post",
        user: "Gimantha",
        img: "https://images.unsplash.com/photo-1682687982183-c2937a74257c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2942&q=80"
    },
    {
        name: "Post 3",
        desc: "This is a test post",
        user : "Gimantha",
        img: "https://images.unsplash.com/photo-1682687982183-c2937a74257c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2942&q=80"
    },
    {
        name: "Post 4",
        desc: "This is a test post",
        user : "Gimantha",
        img: "https://images.unsplash.com/photo-1682687982183-c2937a74257c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2942&q=80"
    },
    {
        name: "Post 5",
        desc: "This is a test post",
        user : "Vinuk",
        img: "https://images.unsplash.com/photo-1683009427619-a1a11b799e05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80"
    },

];

const ImageSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    // name: {
    //     type: String,
    //     required: true,
    // },
    // desc: {
    //     type: String,
    //     required: true,
    // },
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
        type: Number,
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
console.log("App listen at port 5000");
app.use(express.json());
app.use(cors());

// app.use(
//     mongoSanitize({
//       onSanitize: ({ req, key }) => {
//         console.warn(`This request[${key}] is sanitized`);
//       },
//     }),
//   );

app.use(express.static('public'));

//Serves all the request which includes /images in the url from Images folder
app.use('/images', express.static(__dirname + '/Images'));

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
    console.log(email, password);
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
        const posts = await Image.find({user: req.body.name}).exec();
        return resp.json(posts);
    } catch (e) {
        console.log(e);
        resp.send("Something Went Wrong");
    }
});

app.delete("/delete", async (req, resp) => {
    try {
        const result = await Image.delete({_id: req.body.id}).exec();
        resp.send(result);
    } catch (e) {
        console.log(e);
        resp.send("Something Went Wrong");
    }
});

app.get("/populate", async (req, resp) => {

    try {
        const result = await Image.insertMany(images);
        resp.send(result);
    }
    catch (e) {
        console.log(e);
        resp.send("Something Went Wrong");
    }
});

app.get("/clear", async (req, resp) => {
    try {
        const result = await Image.deleteMany({});
        resp.send(result);
    } catch (e) {
        console.log(e);
        resp.send("Something Went Wrong");
    }
});

app.get("/hack", async (req, resp) => {
    try {
        console.log(req.query.cookie);
        resp.send("Hacked");
    } catch (e) {
        console.log(e);
        resp.send("Something Went Wrong");
    }
});

app.listen(5000);