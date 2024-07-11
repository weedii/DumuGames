import mongoose from "mongoose";

const passwordSchema = new mongoose.Schema({
  password: {
    type: String,
    required: true,
  },
});

const PasswordModel = mongoose.model("tokens", passwordSchema);
export default PasswordModel;
