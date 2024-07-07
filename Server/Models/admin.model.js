import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    isAdmin: {
      type: Boolean,
      default: true,
    },

    name: {
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

    password: {
      type: String,
      required: true,
      default: null,
    },
  },
  { timestamps: true }
);

const AdminModel = mongoose.model("admins", adminSchema);
export default AdminModel;
