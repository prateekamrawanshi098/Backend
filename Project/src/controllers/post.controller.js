const jwt = require("jsonwebtoken");
const postModel = require("../Model/post.model");
const ImageKit = require("@imagekit/nodejs"); 
const { Folders } = require("@imagekit/nodejs/resources.js");


const imagekit = new ImageKit({
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT,
});

async function createPostController(req, res) {
  
    console.log(req.body, req.file);

    const token = req.cookies.token
    
    if (!token) {
      return res.status(401).json({
        message: "unauthenticated user, token not provided"
      })
    }

  let decoded
  try {
     decoded = jwt.verify(token, process.env.JWT_SECRET)
  }
  catch (err) {
    return res.status(403).json({
      message:"unauthorized access"
    })
  }
  console.log(decoded);
  

    const file = await imagekit.files.upload({
      file: req.file.buffer.toString("base64"),
      fileName: req.file.originalname,
      folder:"insta-clone"
    });

  
  await postModel.create({
    caption: req.body.caption,
    imgURL: file.url,
    userId:decoded.id
  })

  res.status(201).json({
    message:"post created successfully"
  })
  
}

module.exports = {
  createPostController,
};
