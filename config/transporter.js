const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 587, // Default SMTP port, adjust if needed
  secure: false, // Use true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Function to send emails
const sendMail = async (data) => {
  const {
    from = "LDD Real State <nk105000@gmail.com>", // Default sender
    to = "nk105000@gmail.com", // Default recipient
    subject = "Contact Information", // Default subject
    templatePath = path.resolve(__dirname, "../utils/templates/contact.html"), // Template file path
    context = {}, // Data to replace in the template
  } = data;

  // Read and replace placeholders in the template
  let htmlTemplate = fs.readFileSync(templatePath, "utf8");
  Object.keys(context).forEach((key) => {
    const placeholder = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    htmlTemplate = htmlTemplate.replace(placeholder, context[key]);
  });

  const mailOptions = {
    from,
    to,
    subject,
    html: htmlTemplate, // Email body as HTML
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = sendMail;
