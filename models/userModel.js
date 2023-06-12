const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true 
    },
    password:{
        type: String,
        required: true 
    },
    pic: {
        public_id: {
            type: String,
            default:"default",
            required: true
        },
        url: {
            type: String,
            default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
            required: true
        }
    },
    banner: {
        public_id: {
            type: String,
            default:"default",
            required: true
        },
        url: {
            type: String,
            default:"https://res.cloudinary.com/dahj17ckh/image/upload/v1685803066/userAvatars/fo5uj4vfndq7ehdepw87.jpg",
            required: true
        }
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }
},{
    timestamps: true,
}
);

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  
  userSchema.pre("save", async function (next) {
    if (!this.isModified) {
      next();
    }
  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });
  

const User = mongoose.model('User', userSchema);

module.exports = User;