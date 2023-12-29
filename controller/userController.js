const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorhandler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config()

exports.userRegistration = catchAsyncError(async (req, res, next) => {
  let {  email, password, confirm_password } = req.body;

  //validate the user email
  const user = await User.findOne({ email: email });
  if (user) {
    return next(new ErrorHandler("User Already Exists", 400));
  }

  //check the password
  if (password != confirm_password) {
    return next(
      new ErrorHandler("Password and Confirm_Password must be same", 400)
    );
  }

  let trimmedPassword = password.trim();
  if (trimmedPassword.length < 6) {
    return next(
      new ErrorHandler(
        "Password should be greater than or equal to 6 Characters",
        400
      )
    );
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(trimmedPassword, salt);

  //assign the hash password to the password
  req.body.password = hashPassword;

  await User.create(req.body)
    .then(() => {
      res.status(200).send({
        success: true,
        message: "User Registered Successfully",
      });
    })
    .catch((error) => {
      return next(new ErrorHandler(error, 400));
    });
});

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (email && password) {
    let user = await User.findOne({ email: email }).select("+password");
    if (!user)
      return next(new ErrorHandler("Email or Password is not valid", 400));
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      
      const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "5d",
      });
      delete user.password; // delete the password so that user not able to see the hash
      res.status(200).json({
        success: true,
        message: "Login Successful",
        token: token,
        data: user,
      });
    } else return next(new ErrorHandler("Email or Password is not valid", 400));
  } else return next(new ErrorHandler("email & password is required", 400));
});
