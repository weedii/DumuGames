import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    cardType: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    region: {
      type: String,
      default: null,
    },
    quantity: {
      type: Number,
      required: true,
    },
    codes: {
      type: [],
      required: true,
    },
    cardPrice: {
      type: Number,
      required: true,
    },
    totalCardPrice: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const individualOrderSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    cards: {
      type: [cardSchema], // Array of sub-documents representing each card
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const IndividualOrderModel = mongoose.model(
  "individual orders",
  individualOrderSchema
);
export default IndividualOrderModel;
