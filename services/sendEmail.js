const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const sendEmail = async (email, subject, payload, template) => {
  // let testAccount = await nodemailer.createTestAccount();
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: "hotmail", // hostname
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const source = fs.readFileSync(path.join(__dirname, template), "utf8");
    const compiledTemplate = handlebars.compile(source);
    const options = () => {
      return {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        html: compiledTemplate(payload),
      };
    };

    // Send email
    transporter.sendMail(options(), (error, info) => {
      if (error) {
        console.log(error);
        return error;
      } else {
        console.log(info);
        return res.status(200).json({
          success: true,
        });
      }
    });
  } catch (error) {
    console.log("HERE", error);
    return error;
  }
};

/*
Example:
sendEmail(
  "youremail@gmail.com,
  "Email subject",
  { name: "Eze" },
  "./templates/layouts/main.handlebars"
);
*/

module.exports = sendEmail;
