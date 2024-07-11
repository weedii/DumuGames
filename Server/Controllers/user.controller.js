import express from "express";
import { errorHandler } from "../Utils/error.js";
import bcryptjs from "bcryptjs";
import UserModel from "../Models/user.model.js";
import CardModel from "../Models/card.modal.js";
import OrderModel from "../Models/order.model.js";
import IndividualOrderModel from "../Models/order.individuals.model.js";

export const updateUser = async (req, res, next) => {
  const validUser = await UserModel.findById(req.params.id);

  if (req.user._id !== req.params.id && req.body.type !== "admin")
    return next(errorHandler(401, "You can only update your own account!"));

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          first_name:
            req.body.first_name !== ""
              ? req.body.first_name
              : validUser.first_name,
          last_name:
            req.body.last_name !== ""
              ? req.body.last_name
              : validUser.last_name,
          // email: req.body.email !== "" ? req.body.email : validUser.email,
          email: validUser.email,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  // if (req.user._id !== req.params.id)
  //   return next(errorHandler(401, "You can only delete your own Account!"));
  try {
    await UserModel.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const getUserInfoByID = async (req, res, next) => {
  try {
    if (!req.user._id) {
      return next(errorHandler(404, "Missing Fields!"));
    }
    const wholesaler = await UserModel.findById(req.user._id);
    if (!wholesaler) {
      return next(errorHandler(404, "User Not Found!"));
    }
    res.status(200).json({
      success: true,
      data: wholesaler,
      message: "get user info successfully!",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error: error,
      message: "Internal Server Error while getUserInfoByID()",
    });
  }
};

export const getCards = async (req, res, next) => {
  try {
    const wholesaler = await UserModel.findById(req.user._id);
    if (wholesaler.balance < req.body.totalAmount) {
      return next(errorHandler(400, "Insufficient Balance!"));
    }
    const cardsArray = req.body.cardsArray;

    const results = [];
    const orderCards = []; // Array to store card details for the order

    for (const card of cardsArray) {
      const { type, region, amount, quantity, price } = card;

      if (!type || !region || !amount || !quantity || !price) {
        return next(errorHandler(404, "Missing Fields!"));
      }

      const existingCard = await CardModel.findOne({ type });

      // Check if the card has the specified amount for the given region
      const regionCodes =
        existingCard.codes[amount] && existingCard.codes[amount][region];

      if (!regionCodes || existingCard.quantity[amount][region] < quantity) {
        return next(
          errorHandler(
            401,
            `Insufficient codes for the specified ( type: ${type} ) ( region: ${region} ) ( amount: ${amount} ) and ( quantity: ${quantity} )`
          )
        );
      }

      const tmpValidCodesArray = [];
      for (let i = 0; i < regionCodes.length; i++) {
        if (existingCard.codes[amount][region][i].valid) {
          if (tmpValidCodesArray.length === quantity) break;
          tmpValidCodesArray.push(existingCard.codes[amount][region][i].code);
          existingCard.codes[amount][region][i].valid = false;
        }
      }
      existingCard.quantity[amount][region] -= quantity;

      existingCard.markModified("quantity");
      existingCard.markModified("codes");
      await existingCard.save();

      results.push({
        type,
        amount,
        region,
        codes: tmpValidCodesArray,
      });

      // Push card details to orderCards array
      orderCards.push({
        cardType: type,
        amount,
        region,
        quantity,
        codes: tmpValidCodesArray,
        cardPrice: price,
        totalCardPrice: quantity * price,
      });
    }

    const newOrder = new OrderModel({
      userID: req.user._id,
      userEmail: req.user.email,
      cards: orderCards, // Assigning card details array to the cards field of the order
      totalPrice: req.body.totalAmount,
    });
    await newOrder.save();

    wholesaler.balance -= req.body.totalAmount;
    wholesaler.markModified("balance");
    await wholesaler.save();

    res
      .status(200)
      .json({ success: true, results, user: wholesaler, order: newOrder });
  } catch (error) {
    console.error("Error retrieving cards:", error);
    res.status(500).send({
      success: false,
      error: error,
      message: "Internal Server Error",
    });
  }
};

export const getCardsIndividuals = async (req, res, next) => {
  try {
    const userName = req.body.formData.name;
    const userEmail = req.body.formData.email;

    if (!userName || !userEmail) {
      return next(errorHandler(404, "Missing Fields!"));
    }
    if (!req.body.paid) {
      return next(errorHandler(404, "Paiment is required!"));
    }

    const cardsArray = req.body.cardsArray;

    const results = [];
    const orderCards = []; // Array to store card details for the order

    for (const card of cardsArray) {
      const { type, region, amount, quantity, price } = card;

      if (!type || !region || !amount || !quantity || !price) {
        return next(errorHandler(404, "Missing Fields!"));
      }

      const existingCard = await CardModel.findOne({ type });

      // Check if the card has the specified amount for the given region
      const regionCodes =
        existingCard.codes[amount] && existingCard.codes[amount][region];

      if (!regionCodes || existingCard.quantity[amount][region] < quantity) {
        return next(
          errorHandler(
            401,
            `Insufficient codes for the specified ( type: ${type} ) ( region: ${region} ) ( amount: ${amount} ) and ( quantity: ${quantity} )`
          )
        );
      }

      const tmpValidCodesArray = [];
      for (let i = 0; i < regionCodes.length; i++) {
        if (existingCard.codes[amount][region][i].valid) {
          if (tmpValidCodesArray.length === quantity) break;
          tmpValidCodesArray.push(existingCard.codes[amount][region][i].code);
          existingCard.codes[amount][region][i].valid = false;
        }
      }
      existingCard.quantity[amount][region] -= quantity;

      existingCard.markModified("quantity");
      existingCard.markModified("codes");
      await existingCard.save();

      results.push({
        type,
        amount,
        region,
        codes: tmpValidCodesArray,
      });

      // Push card details to orderCards array
      orderCards.push({
        cardType: type,
        amount,
        region,
        quantity,
        codes: tmpValidCodesArray,
        cardPrice: price,
        totalCardPrice: quantity * price,
      });
    }

    const newOrder = new IndividualOrderModel({
      userName,
      userEmail,
      cards: orderCards, // Assigning card details array to the cards field of the order
      totalPrice: req.body.totalAmount,
    });
    await newOrder.save();

    res.status(200).json({ success: true, results, order: newOrder });
  } catch (error) {
    console.error("Error retrieving cards:", error);
    res.status(500).send({
      success: false,
      error: error,
      message: "Internal Server Error",
    });
  }
};

export const getOrders = async (req, res, next) => {
  try {
    if (!req.user._id) {
      return next(errorHandler(404, "Missing Fields!"));
    }
    const wholesaler = await UserModel.findById(req.user._id);
    if (!wholesaler) {
      return next(errorHandler(404, "User Not Found!"));
    }

    const orders = await OrderModel.find({ userID: wholesaler._id });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    return next(errorHandler(500, "Internal Server Error"));
  }
};

export const getUsersEmails = async (req, res, next) => {
  try {
    const users = await UserModel.find({}, { _id: 0, email: 1 });
    const emails = users.map((user) => user.email);

    res.status(200).json({
      success: true,
      emails,
    });
  } catch (error) {
    console.error("Error retrieving emails:", error);
    return next(errorHandler(500, "Internal Server Error"));
  }
};
