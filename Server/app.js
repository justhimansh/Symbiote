const dotenv = require('dotenv');
const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();

dotenv.config({path : './config.env'});
require('./db/conn');
const port = process.env.PORT;

const Users = require('./models/userSchema');

app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser());
 
app.get('/', (req, res)=>{
    res.send("Hello, World");
})

app.post('/register', async (req, res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;
        const repassword = req.body.repassword;

        const createUser = new Users({
            email : email,
            password : password,
            repassword : repassword
        });

        const created = await createUser.save();
        console.log(created);
        res.status(200).send("Success");

    } catch (error) {
        res.status(400).send(error.messsage)
    }
})

app.post('/register', async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const repassword = req.body.repassword;
  
      const createUser = new Users({
        email: email,
        password: password,
        repassword: repassword,
      });
  
      const created = await createUser.save();
      console.log(created);
  
      res.status(200).send("Success");
    } catch (error) {
      console.error('Registration Error:', error);
      res.status(400).send(error.message);
    }
  });
 
app.listen(port, ()=>{
    console.log("Server is Listening")
})