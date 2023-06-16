const Post = require('../models/postModel')
const PostDelete = require('../models/PostDelete')
const cloudinary = require('../utils/cloudinary');

const getUserPosts = async (req, res) => {
  try {
    const userId = req.user._id;

    const posts = await Post.find({ userId }).populate({
      path: 'userId',
      select: 'name email pic'
    }); // Fetch only posts for the given user ID
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getSomeonesUserPosts = async (req, res) => {
  try {
    const userId = req.body.id;
    const posts = await Post.find({ userId }).populate({
      path: 'userId',
      select: 'name email pic'
    }); // Fetch only posts for the given user ID
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter (default to 1 if not provided)
    const limit = 36; // Number of posts to display per page
    const category = req.query.category || '';
    const sort = req.query.sort || 'shuffle'; // Default to 'shuffle' if no sort value is provided

    // Calculate the skip value based on the page number and limit
    const skip = (page - 1) * limit;

    // Find all posts and populate the user data
    const postsQuery = Post.find(category ? { category } : {})
      .populate('userId', 'name email pic')
      .select('_id title description image tags tools category hearts views shares createdAt')
      .lean();

    // Execute the query and get all the posts
    let posts = await postsQuery.exec();

    // Calculate the hearts count for each post
    posts = posts.map(post => ({
      ...post,
      heartsCount: post.hearts.length
    }));

    // Define the sort options based on the 'sort' query parameter
    if (sort === 'hearts') {
      posts.sort((a, b) => b.heartsCount - a.heartsCount);
    } else if (sort === 'views') {
      posts.sort((a, b) => b.views - a.views);
    } else if (sort === 'latest') {
      posts.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sort === 'oldest') {
      posts.sort((a, b) => a.createdAt - b.createdAt);
    } else if (sort === 'shuffle') {
      shuffleArray(posts);
    }

    // Paginate the posts
    posts = posts.slice(skip, skip + limit);

    const totalCount = await Post.countDocuments(category ? { category } : {});
    const totalPages = Math.ceil(totalCount / limit); // Calculate the total number of pages

    res.json({
      posts,
      currentPage: page,
      totalPages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};


// Function to shuffle an array using Fisher-Yates algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
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

const getRecommendations = (req, res) => {
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


// Like a post
const likePost = async (req, res) => {

  const { postId } = req.body;
  const userId = req.user._id; // Assuming you have user authentication middleware
  console.log('postId', postId)
  console.log(userId)
  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const likedIndex = post.hearts.indexOf(userId);

    if (likedIndex === -1) {
      // User has not liked the post, add their ID to likes array
      post.hearts.push(userId);
    } else {
      // User has liked the post, remove their ID from likes array
      post.hearts.splice(likedIndex, 1);
    }

    await post.save();
    res.status(200).json({ message: 'Like toggled successfully' });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Route to check if a user liked a post and retrieve likes and views
const checkLikes = async (req, res) => {
  try {
  
    const { postId } = req.params;
    const userId = req.user._id;
    // console.log(postId)
    // console.log(userId)

    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if the user liked the post
    const liked = post.hearts.includes(userId);

    // Return the likes and views count along with the liked status
    // console.log(liked, 'likeCount:' ,post.hearts.length, 'viewCount:', post.views);
    res.json({ 
      liked, 
      likeCount: post.hearts.length, 
      viewCount: post.views 
    });
  } catch (error) {
    console.error('Error checking likes and views:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Add post view
const viewPost = async (req, res) => {
  const { postId } = req.body;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    post.views += 1;
    await post.save();
    res.status(200).json({ message: 'View added successfully' });
  } catch (error) {
    console.error('Error adding view:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllPosts,
  getUserPosts,
  createPost,
  likePost,
  unlikePost,
  sharePost,
  deletePost,
  getSomeonesUserPosts,
  getRecommendations,
  checkLikes,
  viewPost
  // postRecommendations
};