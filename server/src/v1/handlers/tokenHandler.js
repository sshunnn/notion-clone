// verify JWT middleware
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/user");

const tokenDecode = (req) => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    const bearer = bearerHeader.split(" ")[1];
    try {
      const decodedToken = jwt.verify(bearer, process.env.JWT_SECRET);
      return decodedToken;
    } catch (error) {
      return false;
    }
  } else {
    return false;
  }
};

exports.verifyToken = async (req, res, next) => {
  const tokenDecoded = tokenDecode(req);
  if (tokenDecoded) {
    //　JWTと一致するユーザーを探す
    const user = await User.findById(tokenDecoded.id);
    if (!user) {
      return res.status(401).json({ error: "認証に失敗しました。" });
    }
    req.user = user;
    next();
  } else {
    return res.status(401).json({ error: "認証に失敗しました。" });
  }
};