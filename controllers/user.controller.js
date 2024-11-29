const HasherHelper = require("../helpers/Hasher.helper");
const { User } = require("../models/user.modal");

class UserController {
  createNewUser = async (req, res) => {
    try {
      const checkUser = await User.findOne({ email: req.body.email });

      console.log(req.body.name);

      if (checkUser) {
        return res.status(401).json({ message: "user already exists" });
      }

      const user = await User.create({ ...req.body });

      const { generateToken } = user.schema.methods;

      const accessToken = generateToken({
        _id: user._id,
        email: user.email,
        role: user.role,
      });

      const userData = {
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        name: user.name,
      };

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === "production" ||
          process.env.NODE_ENV === "staging",
        sameSite: process.env.NODE_ENV === "development" ? "Strict" : "None",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        accessToken,
        user: userData,
      });
    } catch (err) {
      console.log({ err });
      res.status(500).json({ err, message: "Internal Server Error" });
    }
  };
  loginViaPassword = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User Not Found" });
      }

      const { generateToken } = user.schema.methods;

      const isVerify = await HasherHelper.compare(password, user.password);
      if (!isVerify)
        return res.status(401).json({ message: "Incorrect Password" });

      const accessToken = generateToken({
        _id: user._id,
        email: user.email,
        role: user.role,
      });

      const userData = {
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        name: user.name,
      };
      res.status(201).json({
        accessToken,
        user: userData,
      });
    } catch (err) {
      console.log({ err });
      res.status(500).json({ err, message: "Internal Server Error" });
    }
  };
  editCurrentUser = async (req, res) => {
    try {
      if (req.body.password) {
        const salt = await HasherHelper.getSalt(10);

        const hash = await HasherHelper.hash(req.body.password, salt);

        req.body.password = hash;
      }

      const user = await User.findByIdAndUpdate(req.user._id, {
        ...req.body,
      });

      if (!user)
        return res.status(409).json({ message: "User doesn't Exists!" });

      res.status(201).message("Successfully Updated!");
    } catch (err) {
      console.log({ err });
      res.status(500).json({ err, message: "Internal Server Error" });
    }
  };
  createAdminUser = async (req, res) => {
    try {
      await User.create({ ...req.body, role: "Admin" });
      res.status(201).message("Successfully Created");
    } catch (err) {
      console.log({ err });
      res.status(500).json({ err, message: "Internal Server Error" });
    }
  };
  getCurrentUser = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      const userData = {
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        role: user.role,
        _id: user._id,
      };
      res.status(200).json({ message: "Current User Data", data: userData });
    } catch (err) {
      console.log({ err });
      res.status(500).json({ err, message: "Internal Server Error" });
    }
  };
  getAllUsers = async (req, res) => {
    try {
      const user = await User.find({
        _id: { $nin: [req.user._id] },
      }).sort({ createdAt: -1 });
      res.status(200).json(user);
    } catch (err) {
      console.log({ err });
      res.status(500).json({ err, message: "Internal Server Error" });
    }
  };
  getUserDetails = async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId);
      if (!user) return res.status(400).json({ message: "User not found" });

      res
        .status(200)
        .json({ message: "User Data Fetched Successfully", data: user });
    } catch (err) {
      console.log({ err });
      res.status(500).json({ err, message: "Internal Server Error" });
    }
  };
}

module.exports.UserController = new UserController();
