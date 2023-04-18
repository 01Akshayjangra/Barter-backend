const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const app = express();
var cookieParser = require('cookie-parser');
const cors = require('cors');
dotenv.config({path:'./config.env'})
require('./db/conn')
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use(cors(), require('./router/user-routes'))
app.use(cors(), require('./router/post-routes'))

const port = process.env.PORT || 5000;   
app.listen(port,()=>{
    console.log(`The server is running at localhost:${port}`)
})