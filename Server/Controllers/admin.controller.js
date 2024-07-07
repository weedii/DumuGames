import jwt from "jsonwebtoken";
import express from "express";
import { errorHandler } from "../Utils/error.js";
import UserModel from "../Models/user.model.js";
import bcryptjs from "bcryptjs";
import CardModel from "../Models/card.modal.js";
import AdminModel from "../Models/admin.model.js";
import OrderModel from "../Models/order.model.js";
import IndividualOrderModel from "../Models/order.individuals.model.js";

export const updateAdmin = async (req, res, next) => {
  const validAdmin = await AdminModel.findById(req.user._id);
  if (req.user._id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account!"));

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const updateUser = await AdminModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name || validAdmin.name,
          email: req.body.email || validAdmin.email,
          password: req.body.password || validAdmin.password,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updateUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req, res, next) => {
  const validUser = await UserModel.findById(req.body.id);

  if (req.user._id !== req.params.id)
    return next(errorHandler(401, "You don't have access to this point!"));

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.body.id,
      {
        $set: {
          verification_status: req.body.status || validUser.verification_status,
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

export const getUsers = async (req, res, next) => {
  UserModel.find()
    .then((users) => res.status(200).json(users))
    .catch((err) => res.json(err));
};

export const getAdmins = async (req, res, next) => {
  AdminModel.find()
    .then((users) => res.status(200).json(users))
    .catch((err) => res.json(err));
};

export const getUserInfoByID = async (req, res, next) => {
  try {
    if (!req.body._id) {
      return next(errorHandler(404, "Missing Fields!"));
    }
    const wholesaler = await UserModel.findById(req.body._id);
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

export const getAllCards = async (req, res, next) => {
  try {
    const cards = await CardModel.find(
      {},
      {
        type: 1,
        pictureURL: 1,
        quantity: 1,
        prices: 1,
        regions: 1,
        amountsWithRegions: 1,
      }
    );

    res.status(200).json({
      success: true,
      card: cards,
    });
  } catch (error) {
    console.error("Error retrieving card info:", error);
    res.status(500).send({
      success: false,
      error: error,
      message: "Internal Server Error",
    });
  }
};

export const addCards = async (req, res, next) => {
  const validAdmin = await AdminModel.findById(req.user._id);
  if (!validAdmin) return next(errorHandler(404, "Admin Not Found!"));

  try {
    const { type, region, amount, quantity, price, codes } = req.body;
    let existingCard = await CardModel.findOne({ type });

    if (existingCard) {
      // Update existing card
      for (const key in quantity) {
        if (quantity.hasOwnProperty(key)) {
          if (!existingCard.quantity[key]) {
            existingCard.quantity[key] = {}; // Initialize if key doesn't exist
          }
          // Update or initialize the region quantity
          existingCard.quantity[key][region] =
            (existingCard.quantity[key][region] || 0) + quantity[key][region];
        }
      }

      for (const key in price) {
        if (price.hasOwnProperty(key)) {
          // Update or initialize the price
          existingCard.prices[key] = price[key];
        }
      }

      for (const key in codes) {
        if (codes.hasOwnProperty(key)) {
          if (!existingCard.codes[key]) {
            existingCard.codes[key] = {}; // Initialize if key doesn't exist
          }
          // Update or initialize the region codes
          existingCard.codes[key][region] = (
            existingCard.codes[key][region] || []
          ).concat(codes[key][region].map((code) => ({ code, valid: true }))); // Modify codes to include valid property
        }
      }

      for (const key in existingCard.amountsWithRegions) {
        if (key === amount) {
          if (!existingCard.amountsWithRegions[amount].includes(region)) {
            existingCard.amountsWithRegions[amount].push(region);
          }
        } else {
          existingCard.amountsWithRegions[amount] = [region];
        }
      }

      existingCard.markModified("quantity");
      existingCard.markModified("codes");
      existingCard.markModified("prices");
      existingCard.markModified("amountsWithRegions");
      await existingCard.save();
      res.status(200).json({
        success: true,
        card: existingCard,
        message: "Card updated",
      });
    } else {
      // Create new card
      const newCard = new CardModel({
        type,
        quantity,
        prices: price,
        codes: Object.entries(codes).reduce((acc, [key, value]) => {
          acc[key] = Object.entries(value).reduce(
            (innerAcc, [region, codesArray]) => {
              innerAcc[region] = codesArray.map((code) => ({
                code,
                valid: true,
              }));
              return innerAcc;
            },
            {}
          );
          return acc;
        }, {}),
        amountsWithRegions: req.body.amountsWithRegions,
        pictureURL: req.body.pictureURL,
      });
      const savedCard = await newCard.save();
      res.status(201).json({
        success: true,
        card: savedCard,
        message: "Card created!",
      });
    }
  } catch (error) {
    console.error("Error saving card:", error);
    res.status(500).send({
      success: false,
      error: error,
      message: "Internal Server Error",
    });
  }
};

export const deleteCard = async (req, res, next) => {
  const validAdmin = await AdminModel.findById(req.user._id);
  if (!validAdmin) {
    return next(errorHandler(404, "Admin Not Found!"));
  }

  const cardID = req.body.cardID;
  if (!cardID) {
    return next(errorHandler(204, "Missing Fields!"));
  }

  try {
    await CardModel.findByIdAndDelete(cardID);
    res.status(200).json({
      success: true,
      message: `Card has been delete successfully!`,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error: error,
      message: "Internal Server Error",
    });
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await OrderModel.find(
      {},
      {
        _id: 1,
        userID: 1,
        userEmail: 1,
        cards: 1,
        totalPrice: 1,
        createdAt: 1,
      }
    );

    res.status(200).json({
      success: true,
      orders: orders,
    });
  } catch (error) {
    console.error("Error retrieving oders info:", error);
    return next(errorHandler(500, "Internal Server Error"));
  }
};

export const getOrdersIndividuals = async (req, res, next) => {
  try {
    const orders = await IndividualOrderModel.find(
      {},
      {
        _id: 1,
        userName: 1,
        userEmail: 1,
        cards: 1,
        totalPrice: 1,
        createdAt: 1,
      }
    );

    res.status(200).json({
      success: true,
      orders: orders,
    });
  } catch (error) {
    console.error("Error retrieving oders info:", error);
    return next(errorHandler(500, "Internal Server Error"));
  }
};
