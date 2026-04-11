const jwt=require("jsonwebtoken")

async function identifyUser(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "unauthenticated user, token not provided",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(403).json({
        message: "unauthorized access",
      });
    }

    req.user = decoded
    
    next()

}


module.exports=identifyUser