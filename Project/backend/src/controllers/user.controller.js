const followModel = require("../Model/follow.model");
const userModel=require("../Model/user.model")

async function followUserController(req, res) {
  const followerUsername = req.user.username;
  const followeeUsername = req.params.username;

  if (followeeUsername === followerUsername) {
    return res.status(400).json({
      message: "you cannot follow yourself",
    });
    }

     const isFolloweeExists = await userModel.findOne({ username:followeeUsername });

     if (!isFolloweeExists) {
       return res.status(400).json({
         message: `${followeeUsername} doesn't exists`,
       });
     }
    
    const isAlreadyFollowing =await followModel.findOne({
        followee: followeeUsername,
        follower:followerUsername
    })

    if (isAlreadyFollowing) {
        return res.status(400).json({
            message:`You already follow ${followeeUsername}`
        })
    }

   

  const followRecord = await followModel.create({
    follower: followerUsername,
    followee: followeeUsername,
    status:"pending"
  });

  res.status(201).json({
    message: `request sent to ${followeeUsername}`,
    follow: followRecord,
  });
}


async function unfollowUserController(req, res) {
  
  const followerUsername = req.user.username
  const followeeUsername = req.params.username

  const isFollowingExists = await followModel.findOne({
    followee: followeeUsername,
    follower: followerUsername
  })


  if (!isFollowingExists) {
    return res.status(400).json({
      message: `you already don't follow ${followeeUsername}`
    })
  }

  const unfollowUser = await followModel.findByIdAndDelete(
    isFollowingExists._id
  )


  res.status(200).json({
    message: `you unfollowed ${followeeUsername}  successfully`
  })
  
}

async function getRequestController(req,res) {
  const requests = await followModel.find({
    followee: req.user.username,
    status: "pending"
  })

  if (requests.length===0) {
    return res.status(200).json({
      messgae:"no pending requests"
    })
  }

  
  res.status(200).json({
    requests
  })
}

async function acceptRequestController(req, res) {
  const followerUsername = req.params.username
  const followeeUsername=req.user.username
  const request = await followModel.findOne({
    followee: followeeUsername,
    follower: followerUsername,
    status:"pending"
  })

  if (!request) {
    return res.status(404).json({
      message: `there is no pending requets from ${followerUsername}`
    })
  }
  
  request.status = "accepted"
  
  await request.save()

  res.status(200).json({
    message: `You and ${followerUsername} are now friends`,
    request
  })

}


async function rejectRequestController(req,res) {
  const followerUsername = req.params.username
  const followeeUsername = req.user.username
  
  const request =await followModel.findOne({
    followee: followeeUsername,
    follower: followerUsername,
    status:"pending"
  })

  if (!request) {
    return res.status(404).json({
      message:`no request from ${followerUsername} was found`
    })
  }

  request.status = "rejected"
 
  await request.save();
  res.status(200).json({
    message:`You rejected the request by ${followerUsername}`
  })

}

module.exports = {
  followUserController,
  unfollowUserController,
  getRequestController,
  acceptRequestController,
  rejectRequestController
};
