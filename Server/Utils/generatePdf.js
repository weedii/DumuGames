import PDFDocument from "pdfkit";
import fs from "fs";

// Function to create a PDF invoice
export function createInvoice(orderInfo, filePath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Add the invoice content
    doc.fontSize(18).text("DumuGames", { align: "center" });
    doc.moveDown();

    doc.fontSize(10).text(`INVOICE: #${orderInfo._id}`, { align: "left" });
    doc.text(`Date: ${orderInfo.createdAt}`, { align: "left" });
    doc.text(`Status: Paid`, { align: "left" });
    doc.moveDown();

    doc.text("BILLED TO", { align: "left" });
    doc.text(`Name: ${orderInfo.userName}`, { align: "left" });
    doc.text(`Email: ${orderInfo.userEmail}`, { align: "left" });
    doc.moveDown();

    orderInfo.cards.forEach((card) => {
      doc.fontSize(10);
      doc.text(`Type: ${card.cardType}`, { align: "left" });
      doc.text(`Amount: ${card.amount}$`, { align: "left" });
      doc.text(`Quantity: ${card.quantity}`, { align: "left" });
      doc.text(`Card Price: ${card.cardPrice}$`, { align: "left" });
      doc.text(`List of codes:`, { align: "left" });

      // Concatenate codes with pipe separator
      const codesString = card.codes.join(" | ");
      doc.text(codesString, { align: "left" });

      doc.moveDown();
    });
    doc.moveDown();

    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    doc.text(`Total: ${orderInfo.totalPrice}$`, { align: "right" });
    doc.moveDown();
    doc.text("DumuGames Team.", { align: "right" });

    doc.end();

    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}

export const deleteInvoiceFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error removing file: ${err}`);
      return false;
    }
    return true;
  });
};
