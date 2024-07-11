import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    isAdmin: {
      type: Boolean,
      default: false,
    },

    first_name: {
      type: String,
      required: true,
      default: null,
    },

    last_name: {
      type: String,
      required: true,
      default: null,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      default: null,
    },

    phone: {
      type: String,
      required: true,
      default: null,
    },

    country: {
      type: String,
      required: true,
      default: null,
    },

    gender: {
      type: String,
      required: true,
      default: null,
    },

    identification_type: {
      type: String,
      required: true,
      default: null,
    },

    id_picture: {
      type: String,
      required: true,
      default: null,
    },

    selfie_id_picture: {
      type: String,
      required: true,
      default: null,
    },

    balance: {
      type: Number,
      default: 0,
    },

    verification_status: {
      type: String,
      enum: ["accepted", "pending", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("users", userSchema);
export default UserModel;
