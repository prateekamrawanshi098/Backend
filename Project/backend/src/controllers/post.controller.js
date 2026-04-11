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
  

  const userId=req.user.id

  const post = await postModel.find({
    userId: userId,
  });

  res.status(200).json({
    message: "post fetched successfully",
    post,
  });
}

async function getPostDetailsController(req, res) {
  
  const userId=req.user.id

  const postId = req.params.postId;

  const post = await postModel.findById(postId);

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

  return res.status(200).json({
    message: "post fetched successfully",
  });
}


async function likePostController(req,res) {
  const username = req.user.username
  const postId = req.params.postId
  
  const isPostExists = likeModel.findById({ postId })
  
  if (!isPostExists) {
    return res.status(404).json({
      message:"post doesn't exists"
    })
  }

  likeModel.create({
    posts: postId,
    user:username
  })

  res.status(200).json({
    message:"you liked the post successfully"
  })
}

module.exports = {
  createPostController,
  getPostController,
  getPostDetailsController,
  likePostController
};
