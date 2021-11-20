const myMessage = require("emailjs").Message;
const myClient = require("emailjs").SMTPClient;
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const sendEmail = async (email, subject, payload, template) => {
  const client = new myClient({
    user: process.env.EMAIL,
    password: process.env.PASSWORD,
    host: "smtp-mail.outlook.com",
    tls: {
      ciphers: "SSLv3",
    },
  });

  const source = fs.readFileSync(path.join(__dirname, template), "utf8");
  const compiledTemplate = handlebars.compile(source);

  const message = new myMessage({
    from: `Fares ${process.env.EMAIL}`,
    to: email,
    subject: subject,
    attachment: [{ data: compiledTemplate(payload), alternative: true }],
  });

  client.send(message, (err, message) => {
    console.log(err || message);
  });
};

module.exports = sendEmail;
