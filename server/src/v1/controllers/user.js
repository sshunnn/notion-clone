const cryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.register = async (req, res) => {
    const password = req.body.password;

    try {
      req.body.password = cryptoJS.AES.encrypt(
        password,
        process.env.CRYPTO_SECRET
      ).toString();
      // create user
      const user = await User.create(req.body);
      // create JWT
      const token = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      return res.status(201).json({ user, token });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

exports.login = async (req, res) => {
    const { username, password } = req.body;
    
    try {
      const user = await User.findOne({username: username})
      if (!user) {
        return res.status(401).json({ error: {
          params: "username",
          message: "ユーザー名またはパスワードが正しくありません。"
        } });
      }
  
      // match password
      const decryptedPassword = cryptoJS.AES.decrypt(
        user.password,
        process.env.CRYPTO_SECRET
      ).toString(cryptoJS.enc.Utf8);

      if (decryptedPassword !== password) {
        return res.status(401).json({ error: {
          params: "password",
          message: "ユーザー名またはパスワードが正しくありません。"
        } });
      }

      // create JWT
      const token = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(200).json({ user, token });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  