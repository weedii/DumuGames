import express from "express";
import {
  ResendPass,
  signin,
  signinWholesale,
  signout,
  signupWholesale,
} from "../Controllers/auth.controller.js";

const router = express.Router();

router.post("/signup-wholesale", signupWholesale);
router.post("/signin-wholesale", signinWholesale);
router.post("/signin", signin);
router.get("/signout", signout);
router.post("/resend-pass", ResendPass);

export default router;
