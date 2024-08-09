import nodemailer from "nodemailer";
import { createInvoice } from "./generatePdf.js";

export const sendEmailCreation = async (email, user) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: "Account Creation Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9; text-align: center;">
          <img src="https://res.cloudinary.com/dvvoavjc3/image/upload/v1723069852/fjgj0o5wadirqiquzjtn.png" alt="DumuGames Logo" style="max-width: 100px; margin-bottom: 20px;" />
          <h2 style="color: #333;">Hello ${user.first_name},</h2>
          <p style="font-size: 16px; color: #555;">Welcome to <strong>DumuGames</strong>!</p>
          <p style="font-size: 16px; color: #555;">Our staff will review your information, and you will be notified about your account verification within the next 24 hours.</p>
          <br>
          <p style="font-size: 16px; color: #555;">Best Regards,</p>
          <p style="font-size: 16px; color: #555;"><strong>DumuGames Team</strong></p>
        </div>
      `,
    });

    console.log("Email Send Successfully!");
  } catch (error) {
    console.log("Error while sending email");
    console.log(error);
  }
};

export const sendEmailSignin = async (email, generatedPass) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: "Signin Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9; text-align: center;">
          <img src="https://res.cloudinary.com/dvvoavjc3/image/upload/v1723069852/fjgj0o5wadirqiquzjtn.png" alt="DumuGames Logo" style="max-width: 100px; margin-bottom: 20px;" />
          <h2 style="color: #333;">Hello ${email},</h2>
          <p style="font-size: 16px; color: #555;">Welcome to <strong>DumuGames</strong>!</p>
          <p style="font-size: 16px; color: #555;">We are excited to have you on board.</p>
          <p style="font-size: 16px; color: #555;">Here is your password to sign in:</p>
          <p style="font-size: 18px; color: #333; font-weight: bold;">${generatedPass}</p>
          <p style="font-size: 16px; color: #555;">Keep it safe and don't share it with anyone.</p>
          <br>
          <p style="font-size: 16px; color: #555;">Best Regards,</p>
          <p style="font-size: 16px; color: #555;"><strong>DumuGames Team</strong></p>
        </div>
      `,
    });

    console.log("Email Send Successfully!");
  } catch (error) {
    console.log("Error while sending email");
    console.log(error);
  }
};

export const sendEmailUpdateUserStatus = async (email) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: "DumuGames account status",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9; text-align: center;">
          <img src="https://res.cloudinary.com/dvvoavjc3/image/upload/v1723069852/fjgj0o5wadirqiquzjtn.png" alt="DumuGames Logo" style="max-width: 100px; margin-bottom: 20px;" />
          <h2 style="color: #333;">Hello ${email},</h2>
          <p style="font-size: 16px; color: #555;">Your account has been successfully verified by our staff.</p>
          <p style="font-size: 16px; color: #555;">You can <strong>Sign-in</strong> to your account</p>
          <a href="http://localhost:3000/sign-in" style="width: 50%; display: inline-block; background-color: #5956E9; padding: 10px 20px; border-radius: 5px; color: white; font-weight: bold; text-decoration: none; font-size: 16px; border: 1px solid #ccc; transition: opacity 0.3s ease;">
            Sign-in Now
          </a>
          <br><br>
          <p style="font-size: 16px; color: #555;">Best Regards,</p>
          <p style="font-size: 16px; color: #555;"><strong>DumuGames Team</strong></p>
        </div>
      `,
    });

    console.log("Email Send Successfully!");
  } catch (error) {
    console.log("Error while sending email");
    console.log(error);
  }
};

export const sendEmailOrder = async (email, orderInfo) => {
  const filePath = `invoice_${orderInfo._id}.pdf`;
  createInvoice(orderInfo, filePath);

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    console.log();

    const orderItemsHtml = orderInfo.cards
      .map((item, key) => {
        return `
          <div key="${key}">
            <div style="margin-bottom: 25px">
              <p style="margin-bottom: 0px">Type: <strong>${item.cardType}</strong></p>
              <p style="margin-bottom: 0px">Amount: ${item.amount}$</p>
              <p style="margin-bottom: 0px">Quantity: ${item.quantity}</p>
              <p style="margin-bottom: 0px">Card Price: ${item.cardPrice}$</p>
              <hr />
              </div>
          </div>
        `;
      })
      .join("");

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: "Success Order | DumuGames",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9; text-align: center;">
          <img src="https://res.cloudinary.com/dvvoavjc3/image/upload/v1723069852/fjgj0o5wadirqiquzjtn.png" alt="DumuGames Logo" style="max-width: 100px; margin-bottom: 20px;" />
          <h2 style="color: #333;">Hello ${email},</h2>
          <p style="font-size: 16px; color: #555;">Thank you for choosing <strong>DumuGames</strong>!</p>
          <p style="font-size: 16px; color: #555;"><strong>Order Information</strong></p>

          <div style="width: 50%; margin: auto; padding: 10px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9; text-align: start;">
            ${orderItemsHtml}
            <p style="margin-bottom: 0px">Total Price: ${orderInfo.totalPrice}$</p>
          </div>
          <br>
          <p style="font-size: 16px; color: #555;">Best Regards,</p>
          <p style="font-size: 16px; color: #555;"><strong>DumuGames Team</strong></p>
        </div>
      `,
      attachments: [
        {
          filename: filePath,
          path: filePath,
        },
      ],
    });

    console.log("Email Send Successfully!");
    return filePath;
  } catch (error) {
    console.log("Error while sending email");
    console.log(error);
  }
};
