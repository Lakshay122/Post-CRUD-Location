const express = require('express');
const app = express(); 
const errorMiddleware = require("./middleware/error");
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');


dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(cors())
app.use(passport.initialize());

app.get('/health',(req,res) => {
res.status(200).send('OK');
})


//routes
const users = require('./routes/userRoutes');
const posts = require('./routes/postRoutes');

app.use("/api",users);
app.use("/api",posts);

app.use(errorMiddleware); //this line is written into end bcs we need the error in json format

module.exports =app;