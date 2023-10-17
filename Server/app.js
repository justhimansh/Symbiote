const dotenv = require('dotenv');
const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();

dotenv.config({path : './config.env'});
require('./db/conn');
const port = process.emitWarning.PORT;

const Users = require('./models/userSchema');

app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser());
 
app.get('/', (req, res)=>{
    res.send("Hello, World");
})

app.post('/register', async (req, res)=>{
    try {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        const createUser = new Users({
            username : username,
            email : email,
            password : password
        });

        const created = await createUser.save(); 
        console.log(created);
        res.status(400).send(error)
    } catch (error) {
        
    }
})
 
app.listen(port, ()=>{
    console.log("Server is Listening")
})