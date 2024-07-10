import nodemailer from "nodemailer";

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
        <div>
          <h4>Hello ${user.first_name},</h4>
          <h4>Welcome To DumuGames!</h4>
          <br>
          <p>Our staff will view your info, You will get notified about your account verification in the comming 24h</p>
          <br>
          <p>keep in mind that for every signin-in to your account after confirmation we will send you a new password to signin for Security purposes!</p>
          <br>
          <p>Best Regards!</p>
          <h4>DumuGames Team</h4>
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
        <div>
          <h4>Hello ${email},</h4>
          <h4>Welcome To DumuGames!</h4>
          <br>
          <h4>Your Password is: ${generatedPass}</h4>
          <br>
          <h4>DumuGames Team</h4>
        </div>
      `,
    });

    console.log("Email Send Successfully!");
  } catch (error) {
    console.log("Error while sending email");
    console.log(error);
  }
};
