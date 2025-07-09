import express, { request } from 'express';
import mongoose from 'mongoose';
import usersRouter from './routers/users.mjs';
import dotenv from 'dotenv';
import session from 'express-session';
 // Load environment variables from .env file
//import passport from 'passport';


//import {User} from './models/user.mjs'; // Adjust the path as necessary
const app = express();
//const mongoose = require('mongoose');
dotenv.config(); // Load environment variables from .env file
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

app.use(express.json()); // Middleware to parse JSON request 
app.use(usersRouter);
app.use(session({
    secret: "Ruy the dev",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, //
    }
}));
//app.use(passport.initialize());
//app.use(passport.session());
const uri = process.env.MONGO_URI ;
 
const PORT = process.env.PORT || 3000;

async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await mongoose.disconnect();
  }
}

app.listen(PORT, () => {
    //run().catch(console.dir);
    run().then(() => {
        console.log("Connected to MongoDB successfully");
    }).catch(err => {
        console.error("Failed to connect to MongoDB", err);
    });
  console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {

    console.log(req.session);
    console.log(req.session.id);
    req.session.visited = true;
    res.send('Hello, World!');
});
