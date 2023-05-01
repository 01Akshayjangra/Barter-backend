// const mongoose = require("mongoose");
// const DB = process.env.DATABASE;

// const connectDB = async () => {
//   mongoose.connect(DB).then(() => {
//     console.log("DB Connected");
//   })
//     .catch((err) => console.log('no connection'));
// };

// module.exports = connectDB;

const mongoose = require('mongoose');

const DB = process.env.DATABASE;   

mongoose.connect(DB).then(()=>{
    console.log("DB Connected");
}).catch((err)=> console.log('no connection'));