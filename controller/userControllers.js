import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Token from "../model/token.js";

import dotenv from "dotenv";

import sendEmail from "../utils/sendEmail.js";

dotenv.config();

export const SignUser = async (request, response) => {
  try {
    //  const hashPassword = await bcrypt.hash(request.body.password, 10);
    //  console.log("hashpassword is ",hashPassword);

    const user = {
      fullname: request.body.fullname,
      mobileno: request.body.mobileno,
      gender: request.body.gender,
      email: request.body.email,
      // password: hashPassword,
      password: request.body.password,
    };

    const newUser = new User(user);

    await newUser.save();

    const fullname = request.body.fullname;
    const subject = `नमस्कार ${fullname} Long Day Jobs मध्ये तुमच स्वागत आहे`;
    const message = "धन्यवाद";
    const email = request.body.email;
    // try {
      await sendEmail(email, subject, message);
      // response
      //   .status(200)
      //   .json({ success: true, message: "email send to user" });
    // } catch (error) {
    //   console.log("error in email");
    //   response.json({ message: error.message });
    //   return alert("enter valid email");
    // }
    return response.status(200).json({
      message: "sign up successfully",
    });
  } catch (error) {
    return response.status(500).json({
      message: "Error while sign up the user",
    });
  }
};

export const loginUser = async (request, response) => {
  let userExist = await User.findOne({
    email: request.body.email,
  });

  if (!userExist) {
    return response.status(400).json({ message: "username does not exist" });
  }
  try {
    // let match = await bcrypt.compare(request.body.password, userExist.password);
    if (userExist.password === request.body.password) {
      const accessToken = jwt.sign(
        userExist.toJSON(),
        process.env.ACCESS_SECRET_KEY,
        {
          expiresIn: "15m",
        }
      );

      const refreshToken = jwt.sign(
        userExist.toJSON(),
        process.env.ACCESS_REFRESH_KEY
      );
      const newToken = new Token({ token: refreshToken });
      await newToken.save();

      return response.status(200).json({
        fullname: userExist.fullname,
        gender: userExist.gender,
        message: "login up successfully",
        accessToken: accessToken,
        refreshToken: refreshToken,
        email: userExist.email,
      });
    } else {
      response.status(400).json({
        message: "password does not match",
      });
    }
  } catch (error) {
    //if (match) {
    //   const accessToken = jwt.sign(
    //     userExist.toJSON(),
    //     process.env.ACCESS_SECRET_KEY,
    //     {
    //       expiresIn: "15m",
    //     }
    //   );

    //   const refreshToken = jwt.sign(
    //     userExist.toJSON(),
    //     process.env.ACCESS_REFRESH_KEY
    //   );
    //   const newToken = new Token({ token: refreshToken });
    //   await newToken.save();

    //   return response.status(200).json({
    //     fullname: userExist.fullname,
    //     gender: userExist.gender,
    //     message: "login up successfully",
    //     accessToken: accessToken,
    //     refreshToken: refreshToken,
    //     email: userExist.email
    //   });
    // } else {
    //   response.status(400).json({
    //     message: "password does not match",
    //   });
    // }
    //}
    return response.status(500).json({
      message: "Error while login the user",
    });
  }
};

export const getProfile = async (request, response) => {
  try {
    let email = request.query.email;

    const user = await User.find({ email: email });
    response.status(200).json(user);
  } catch (error) {
    // return next(new AppError("Failed to fetch user details", 400))
    response.status(400).json({ message: "failed to fetch user details" });
  }
};

export const forgotpassword = async (request, response, next) => {
  let email = request.body.email;

  if (!email) {
    response.status(400).json({ message: "email is required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    response.status(400).json({ message: "email not register" });
  }

  const resetToken = await user.generatePasswordResetToken();

  await user.save();

  // const resetPasswordURL = `${process.env.FRONTENDURL}/reset/${resetToken}`
  const resetPasswordURL = `http://localhost:3000/setpassword/${resetToken}`;

  const subject = "reset your password";
  const message = `${resetPasswordURL}`;
  console.log(resetPasswordURL);

  try {
    await sendEmail(email, subject, message);
    response
      .status(200)
      .json({
        success: true,
        message: `reset password has been sent to  ${email}`,
        token: resetToken,
      });
  } catch (error) {
    user.forgotPasswordExpiry = undefined;
    user.forgotPasswordToken = undefined;
    await user.save();
    console.log("error in email");
    response.json({ message: error.message });
  }
};

export const setforgotpassword = async (request, response) => {
  const { resetToken, password } = request.body;

  // const {password} = request.body;

  // const forgotPasswordToken = crypto.create('varad').update(resetToken).digest('hex')
  const forgotPasswordToken = resetToken;
  const user = await User.findOne({
    forgotPasswordToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    response
      .status(400)
      .json({ message: "Token is expired or invalid please try again" });
  }

  user.password = password;

  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  user.save();

  response.status(200).json({ message: "password saved successfully" });
};
