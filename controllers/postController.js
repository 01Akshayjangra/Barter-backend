const Post = require('../models/postModel')
const PostDelete = require('../models/PostDelete')
const cloudinary = require('../utils/cloudinary');

const getUserPosts = async (req, res) => {
  try {
    const userId = req.user._id;

    const posts = await Post.find({ userId }); // Fetch only posts for the given user ID
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const category = req.query.category || '';
    const posts = await Post.find(category ? { category } : {}).populate({
      path: 'userId',
      select: 'name email pic'
    })
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
}
  const createPost = async (req, res) => {
    const { title, description, image, tags, tools, category, avatar, hearts, views, shares } = req.body;
    try {
      console.log(image)
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
        userId: req.user._id
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

  const deletePost = async (req, res) => {
    try {
      const postId = req.body;
      const userId = req.user.id;

      // Check if the user has already deleted the post
      const deletedPost = await PostDelete.findOne({ postId }, userId);
      if (deletedPost) {
        return res.status(400).json({ msg: 'Post already deleted by the user' });
      }
      console.log('here  is err')
      // Check if the user is the owner of the post
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }
      if (post.userId.toString() !== userId) {
        return res.status(401).json({ msg: 'Unauthorized' });
      }

      // Delete the post
      await post.remove();

      // Add the deleted post to the PostDelete collection
      const postDelete = new PostDelete({ postId }, userId);
      await postDelete.save();

      res.json({ msg: 'Post deleted successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }

  // Like a post
  const likePost = async (req, res) => {
    const { postId } = req.body;
    try {
      const post = await Post.findByIdAndUpdate(
        postId,
        { $inc: { hearts: 1 } },
        { new: true }
      );
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
  // Unlike a post
  const unlikePost = async (req, res) => {
    const { postId } = req.body;
    try {
      const post = await Post.findByIdAndUpdate(
        postId,
        { $inc: { hearts: -1 } },
        { new: true }
      );
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }

  // Share a post
  const sharePost = async (req, res) => {
    const { postId } = req.body;
    try {
      const post = await Post.findByIdAndUpdate(
        postId,
        { $inc: { shares: 1 } },
        { new: true }
      );
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }



  
const getSomeonesUserPosts = async (req, res) => {
  try {
    const userId  = req.body.id;
    const posts = await Post.find({userId}); // Fetch only posts for the given user ID
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getRecommendations = (req,res)=>{
  const postIds = req.body.ids;
  Post.find({ _id: { $in: postIds } }).populate({
    path: 'userId',
    select: 'name email pic'
  }) // find all posts where the _id field is in the postIds array
  .then(posts => res.json(posts)) // return the fetched posts as a JSON response
  .catch(error => {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' }); // return an error response if something went wrong
  });
}

  module.exports = {
    getAllPosts,
    getUserPosts,
    createPost,
    likePost,
    unlikePost,
    sharePost,
    deletePost,
    getSomeonesUserPosts,
    getRecommendations
    // postRecommendations
  };