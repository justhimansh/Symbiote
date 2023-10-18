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
        res.status(200).send(created);

    } catch (error) {
        res.status(400).send("Invalid")
    }
})

app.post('/login', async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
  
      const createUser = new Users({
        email: email,
        password: password,
      });
  
      const user = await Users.findOne({email : email});
      if(user){
        const isMatch = await bcryptjs.compare(password, user.password);

        if(isMatch){
          const token = await user.generateToken();
          res.cookie("jwt", token, {
            expires : new Date(Date.now() + 86400000),
            httpOnly : true
          })

          res.status(200).send("Success");
        }else{
          res.status(400).send("Invalid");
        }
      }else{
        res.status(400).send("Invalid");
      }
    } catch (error) {
      res.status(400).send("Invalid");
    }
  });
 
app.listen(port, ()=>{
    console.log("Server is Listening")
})