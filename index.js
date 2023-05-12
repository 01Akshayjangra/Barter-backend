const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // import cors package

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

var cookieParser = require('cookie-parser');
const app = express();
// const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const path = require("path");

dotenv.config({ path: './config.env' })
require("./config/db");

const whitelist = ['https://barterr.vercel.app'];
// const whitelist = ['https://localhost:3000'];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

app.use(cors(corsOptions));
app.use(express.json()); //to accept json data
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api", postRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`The server is running at localhost:${port}`)
})