import PasswordModel from "../Models/password.modal.js";
import crypto from "crypto";

const generateRandomPassword = async (userID) => {
  const isPassExist = await PasswordModel.findById(userID);
  if (isPassExist) return isPassExist.password;

  const password = new PasswordModel({
    _id: userID,
    password: crypto.randomBytes(16).toString("hex"),
  });
  await password.save();

  return password.password;
};

export default generateRandomPassword;
