import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import UserModel from "../Models/user.model.js";
import { errorHandler } from "../Utils/error.js";
import crypto from "crypto";
import { sendEmailCreation, sendEmailSignin } from "../Utils/sendEmail.js";
import generateRandomPassword from "../Utils/generatePassword.js";
import AdminModel from "../Models/admin.model.js";
import PasswordModel from "../Models/password.modal.js";

export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  const foundUser = await UserModel.findOne({ email });
  if (foundUser) {
    return next(errorHandler(403, "User Already Exists!"));
  }
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new UserModel({ name, email, password: hashedPassword });

  try {
    // res.status(201).json("User Created Successfully!");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await UserModel.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User Not Found!"));

    const validPassword = await PasswordModel.findById({ _id: validUser._id });
    if (validPassword) {
      if (validPassword.password !== password) {
        return next(errorHandler(400, "Invalid Password!"));
      }
    } else {
      await validPassword.deleteOne();
      return next(errorHandler(404, "Missing Password!"));
    }

    if (validUser.verification_status === "pending") {
      return next(
        errorHandler(
          403,
          "Your Account Status is still Pending you will get notified in the up-comming 24h!"
        )
      );
    }

    if (validUser.verification_status === "rejected") {
      return next(
        errorHandler(403, "Your Account has been rejected by DumuGames Team!")
      );
    }

    const {
      isAdmin: isAdmin,
      identification_type,
      id_picture: id_picture,
      selfie_id_picture: selfie_id_picture,
      ...rest
    } = validUser._doc;
    const token = jwt.sign({ user: validUser }, process.env.JWT_SECRET);

    await validPassword.deleteOne();

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 2592000000,
      })
      .status(200)
      .json({
        success: true,
        userInfo: rest,
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const signupWholesale = async (req, res, next) => {
  if (
    !req.body.first_name ||
    !req.body.last_name ||
    !req.body.email ||
    !req.body.gender ||
    !req.body.country ||
    !req.body.phone ||
    !req.body.identification_type ||
    !req.body.id_picture ||
    !req.body.selfie_id_picture
  ) {
    return next(errorHandler(403, "Missing Fields!"));
  }

  const {
    first_name,
    last_name,
    email,
    gender,
    country,
    phone,
    identification_type,
    id_picture,
    selfie_id_picture,
  } = req.body;
  const foundUser = await UserModel.findOne({ email });
  if (foundUser) {
    return next(errorHandler(403, "User Already Exists!"));
  }

  const newUser = new UserModel({
    first_name,
    last_name,
    email,
    gender,
    country,
    phone,
    identification_type,
    id_picture,
    selfie_id_picture,
  });

  try {
    await newUser.save();

    await sendEmailCreation(email, newUser);
    res.status(200).send("Email was sent check your box mail!");

    // res.status(201).json("User Created Successfully!");
  } catch (error) {
    next(error);
  }
};

export const signinWholesale = async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(errorHandler(403, "Missing Fields!"));

  try {
    const validUser = await UserModel.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User Not Found!"));
    else if (validUser.verification_status === "pending") {
      return next(
        errorHandler(
          403,
          "Your Account Status is still Pending you will get notified in the up-comming 24h!"
        )
      );
    } else if (validUser.verification_status === "rejected") {
      return next(
        errorHandler(403, "Your Account has been rejected by DumuGames Team!")
      );
    } else {
      const generatedPass = await generateRandomPassword(validUser._id);
      await sendEmailSignin(email, generatedPass);

      res.status(200).json({
        success: true,
        email: validUser.email,
        message: "Email was sent check your box mail!",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const SignUpAdmin = async (req, res, next) => {
  const { name, email, password } = req.body;
  const foundAdmin = await AdminModel.findOne({ email });
  if (foundAdmin) {
    return next(errorHandler(403, "Admin Already Exists!"));
  }
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newAdmin = new AdminModel({ name, email, password: hashedPassword });
  try {
    await newAdmin.save();
    res.status(201).json("Admin Created Successfully!");
  } catch (error) {
    next(error);
  }
};

export const SignInAdmin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await AdminModel.findOne({ email });
    if (!validUser) return next(errorHandler(404, "Admin Not Found!"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Invalid Password!"));

    const { password: pass, ...rest } = validUser._doc;
    const token = jwt.sign({ user: validUser }, process.env.JWT_SECRET);

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 2592000000,
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.status(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
};

export const ResendPass = async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(errorHandler(403, "Missing Fields!"));

  const validUser = await UserModel.findOne({ email });
  if (!validUser) return next(errorHandler(404, "User Not Found!"));

  const generatedPass = await generateRandomPassword(validUser._id);
  await sendEmailSignin(email, generatedPass);

  res.status(200).json({ success: true, msg: "Please check you box mail!" });
};
