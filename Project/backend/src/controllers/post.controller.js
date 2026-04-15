const jwt = require("jsonwebtoken");
const postModel = require("../Model/post.model");
const ImageKit = require("@imagekit/nodejs");
const { Folders } = require("@imagekit/nodejs/resources.js");
const likeModel = require("../Model/like.model");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT,
});

async function createPostController(req, res) {
  console.log(req.body, req.file);

  const file = await imagekit.files.upload({
    file: req.file.buffer.toString("base64"),
    fileName: req.file.originalname,
    folder: "insta-clone",
  });

  await postModel.create({
    caption: req.body.caption,
    imgURL: file.url,
    userId: req.user.id,
  });

  res.status(201).json({
    message: "post created successfully",
  });
}

async function getPostController(req, res) {
  const userId = req.user.id;

  const post = await postModel.find({
    userId: userId,
  });

  res.status(200).json({
    message: "post fetched successfully",
    post,
  });
}

async function getPostDetailsController(req, res) {
  const userId = req.user.id;

  const postId = req.params.postId;

  const post = await postModel.findById(postId).populate("userId");

  if (!post) {
    return res.status(404).json({
      message: "post not found",
    });
  }

  const isValidUser = post.userId.toString() === userId;

  if (!isValidUser) {
    return res.status(403).json({
      message: "forbidden",
    });
  }

  const likesCount = await likeModel.countDocuments({ posts: postId });
  const isLiked = !!(await likeModel.findOne({
    posts: postId,
    user: req.user.username,
  }));

  return res.status(200).json({
    message: "post fetched successfully",
    post: {
      ...post.toObject(),
      likesCount,
      isLiked,
    },
  });
}

async function likePostController(req, res) {
  const username = req.user.username;
  const postId = req.params.postId;

  const isPostExists = await postModel.findById(postId);

  if (!isPostExists) {
    return res.status(404).json({
      message: "post doesn't exists",
    });
  }

  const existingLike = await likeModel.findOne({
    posts: postId,
    user: username,
  });

  let isLiked = false;

  if (existingLike) {
    await likeModel.deleteOne({ _id: existingLike._id });
  } else {
    await likeModel.create({
      posts: postId,
      user: username,
    });
    isLiked = true;
  }

  const likesCount = await likeModel.countDocuments({ posts: postId });

  res.status(200).json({
    message: isLiked
      ? "you liked the post successfully"
      : "you unliked the post successfully",
    postId,
    likesCount,
    isLiked,
  });
}

async function getFeedController(req, res) {
  const posts = await postModel.find().populate("userId");

  const postIds = posts.map((post) => post._id);

  const likes = await likeModel.find({
    posts: { $in: postIds },
  });

  const likeCountMap = new Map();
  const likedByCurrentUser = new Set();

  likes.forEach((like) => {
    const key = like.posts.toString();
    likeCountMap.set(key, (likeCountMap.get(key) || 0) + 1);
    if (like.user === req.user.username) {
      likedByCurrentUser.add(key);
    }
  });

  const enrichedPosts = posts.map((post) => {
    const key = post._id.toString();
    return {
      ...post.toObject(),
      likesCount: likeCountMap.get(key) || 0,
      isLiked: likedByCurrentUser.has(key),
    };
  });

  res.status(200).json({
    message: "post fetched successfully",
    posts: enrichedPosts,
  });
}

module.exports = {
  createPostController,
  getPostController,
  getPostDetailsController,
  likePostController,
  getFeedController,
};
