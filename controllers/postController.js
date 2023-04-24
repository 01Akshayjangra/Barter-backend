const Post = require('../models/postModel')

const getUserPosts = async (req, res) => {
    try {
      // const userId = req.params.userId;
      const userId = req.user.user_id;
      // const userId = req.user._id;
      console.log(userId)
      const posts = await Post.find({ userId }); // Fetch only posts for the given user ID
      res.json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };
  
  const getAllPosts = async (req,res) => {
    try {

      const posts = await Post.find({}).exec(); 
      res.json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }

const createPost = async (req, res) => {
  try {
    const { title, image, tags, tools, category, avatar } = req.body;
    // const userId = req.user.user_id;
    const userId = req.user._id;
    const hearts = 0;
    const views = 0;
    const shares = 0;
    const tagArray = tags.split(',').filter((t) => t.trim() !== '');
    const toolArray = tools.split(',').filter((t) => t.trim() !== '');
    const newPost = new Post({ title, image, tags: tagArray, tools: toolArray, category, avatar, hearts, views, shares, userId });

    const savePost = await newPost.save();
    res.status(201).json(savePost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
    getAllPosts,
    getUserPosts,
    createPost,
};