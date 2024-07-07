import express from "express";
import { verifyAdmin } from "../Utils/verifyUser.js";
import {
  addCards,
  deleteCard,
  getAdmins,
  getAllCards,
  getOrders,
  getOrdersIndividuals,
  getUserInfoByID,
  getUsers,
  updateAdmin,
  updateUserStatus,
} from "../Controllers/admin.controller.js";
import { SignInAdmin, SignUpAdmin } from "../Controllers/auth.controller.js";

const router = express.Router();

router.post("/signup-admin", SignUpAdmin);
router.post("/signin-admin", SignInAdmin);
router.post("/update-admin/:id", verifyAdmin, updateAdmin);
router.post("/update-user-status/:id", verifyAdmin, updateUserStatus);
router.get("/get-users", verifyAdmin, getUsers);
router.get("/get-admins", verifyAdmin, getAdmins);
router.post("/get-user-info-by-id", verifyAdmin, getUserInfoByID);
router.post("/add-cards", verifyAdmin, addCards);
router.get("/get-all-cards", getAllCards);
router.post("/delete-card", verifyAdmin, deleteCard);
router.get("/get-orders", getOrders);
router.get("/get-orders-individuals", getOrdersIndividuals);

export default router;
