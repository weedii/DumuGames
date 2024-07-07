import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    quantity: {
      type: Object,
      required: true,
    },
    prices: {
      type: Object,
      required: true,
    },
    codes: {
      type: Object,
      required: true,
    },
    pictureURL: {
      type: String,
      required: true,
      default: null,
    },
    amountsWithRegions: {
      type: {},
      default: [],
    },
  },
  { timestamps: true }
);

const CardModel = mongoose.model("cards", cardSchema);
export default CardModel;
