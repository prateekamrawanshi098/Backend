const express = require("express")
const postController = require("../controllers/post.controller")
const getController=require("../controllers/post.controller")
const multer = require("multer")
const upload = multer({ storage: multer.memoryStorage() })
const identifyUser = require("../middlewares/auth.middleware");


const postRouter = express.Router()

postRouter.post("/post", upload.single("image"),identifyUser, postController.createPostController)

postRouter.get("/post", identifyUser,postController.getPostController);

postRouter.get(
  "/details/:postId",
  identifyUser,postController.getPostDetailsController,
);

postRouter.post("/like/:postId", identifyUser, postController.likePostController)

postRouter.get("/posts/feed",identifyUser,postController.getFeedController)

module.exports=postRouter