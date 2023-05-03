const mongoose = require('mongoose');

const postDeleteSchema = new mongoose.Schema({
  postId: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return mongoose.Types.ObjectId.isValid(v);
      },
      message: props => `${props.value} is not a valid ObjectId`
    }
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const PostDelete = mongoose.model('PostDelete', postDeleteSchema);
module.exports = PostDelete;
