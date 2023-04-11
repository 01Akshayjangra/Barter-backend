const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const app = express();
dotenv.config({path:'./config.env'})
require('./db/conn')
app.use(express.json());
app.use(require('./router/user-routes'))
app.use(require('./router/post-routes'))

const port = process.env.PORT || 5000;   
app.listen(port,()=>{
    console.log(`The server is running at localhost:${port}`)
})