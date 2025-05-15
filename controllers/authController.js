const User = require("../models/User");
const jwt = require("jsonwebtoken");

//generating web tokens

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "12h" });
};

exports.registerUser = async (req, res) => {
  const { fullName, email, password, profileImageUrl } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    //check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      profileImageUrl,
    });

    res
      .status(201)
      .json({ id: user._id, user, token: generateToken(user._id), });
  } catch (err) {
    res.status(500).json({message:"Error in registring user", error:err.message})
  }
};
exports.loginUser = async (req, res) => {
  const {email, password} = req.body;
  if(!email || !password){
    return res.status(400).json({message:"All fields are required!"})
  }
  try {
    const user = await User.findOne({email})

    if(!user || !(await user.comparePassword(password))){
      return res.status(400).json({message:"Invalid Credentials"})
    }

    res.status(200).json({
      id: user._id,
      user,
      token:generateToken(user._id)
    })
  } catch (err) {
    res.status(500).json({message:"Error in user Login", error:err.message})
  }
};
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if(!user){
      res.status(404).json({message:"User not found"})
    }

    res.status(200).json(user)
  } catch (err) {
    res.status(500).json({message:"Error in finding user information", error:err.message})
  }
};
