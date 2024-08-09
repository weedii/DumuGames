import { errorHandler } from "../Utils/error.js";
import generateSignature from "../Utils/generateSignature.js";
import axios from "axios";

export const checkOut = async (req, res, next) => {
  const { orderId, amount, items, payerEmail, payerName } = req.body;

  if (!orderId || !amount || !items || !payerEmail || !payerName) {
    return next(errorHandler(400, "Missing Fields!"));
  }

  const publicKey = process.env.PUBLIC_KEY;
  const secretKey = process.env.SECRET_KEY;
  const signature = generateSignature(orderId, amount, "USD", secretKey);

  const invoiceData = {
    publicKey,
    order: {
      id: orderId,
      amount,
      currency: "USD",
      items,
    },
    signature,
    payer: {
      email: payerEmail,
      extraFields: {
        name: payerName,
      },
    },
    language: "en",
    resultUrl: process.env.RESULT_URL,
    failPath: process.env.FAIL_PATH,
    productUrl: process.env.PRODUCT_URL,
  };

  try {
    const response = await axios.post(
      "https://paydo.com/v1/invoices/create",
      invoiceData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
    return next(errorHandler(500, error));
  }
};

export const topUpWallet = async (req, res, next) => {
  const { orderId, amount, payerEmail, payerName } = req.body;
  if (!orderId) {
    return next(errorHandler(400, "Missing Fields!"));
  }

  const publicKey = process.env.PUBLIC_KEY;
  const secretKey = process.env.SECRET_KEY;
  const signature = generateSignature(orderId, amount, "USD", secretKey);

  const invoiceData = {
    publicKey,
    order: {
      id: orderId,
      amount,
      currency: "USD",
      items: [],
    },
    signature,
    payer: {
      email: payerEmail,
      extraFields: {
        name: payerName,
      },
    },
    language: "en",
    resultUrl: process.env.USER_RESULT_URL,
    failPath: process.env.USER_FAIL_PATH,
    productUrl: process.env.USER_PRODUCT_URL,
  };

  try {
    const response = await axios.post(
      "https://paydo.com/v1/invoices/create",
      invoiceData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
    return next(errorHandler(500, error));
  }
};
