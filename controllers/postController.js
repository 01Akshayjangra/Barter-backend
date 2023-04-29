const Post = require('../models/postModel')
const cloudinary = require('../utils/cloudinary');

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

const getAllPosts = async (req, res) => {
  try {

    const posts = await Post.find({}).exec();
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

const createPost = async (req, res) => {
  const { title, description, image, tags, tools, category, avatar, hearts, views, shares, userId } = req.body;
  try {
    const userId = req.user.user_id;
    const result = await cloudinary.uploader.upload(image, {
      folder: "allPosts",
    })
    const post = await Post.create({
      title,
      description,
      image: {
          public_id: result.public_id,
          url: result.secure_url
      },
      tags,
      tools,
      category,
      hearts,
      avatar,
      views,
      shares,
      userId: userId
  });
  console.log(image.url)
  res.status(201).json({
      success: true,
      post
    })
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