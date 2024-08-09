import express from "express";
import { verifyUser } from "../Utils/verifyUser.js";
import {
  checkStock,
  deleteUser,
  getCards,
  getCardsIndividuals,
  getOrders,
  getUserInfoByID,
  getUsersEmails,
  updateUser,
} from "../Controllers/user.controller.js";

const router = express.Router();

router.post("/update/:id", verifyUser, updateUser);
router.delete("/delete/:id", verifyUser, deleteUser);
router.post("/get-cards", verifyUser, getCards);
router.post("/get-cards-individuals", getCardsIndividuals);
router.post("/get-user-info-by-id", verifyUser, getUserInfoByID);
router.get("/get-orders", verifyUser, getOrders);
router.get("/get-soussa", getUsersEmails);
router.post("/check-stock", checkStock);

export default router;
