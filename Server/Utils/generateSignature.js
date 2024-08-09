import crypto from "crypto";

function generateSignature(orderId, amount, currency, secretKey) {
  const dataString = `${amount}:${currency}:${orderId}:${secretKey}`;
  return crypto.createHash("sha256").update(dataString).digest("hex");
}

export default generateSignature;
