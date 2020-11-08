const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const { compile } = require("handlebars");
const { mailSmtp, jwtSecrets } = require("../config/config");
const {
  signConfirmationToken,
  verifyConfirmationToken,
} = require("../utils/jwt");
const { sign } = require("crypto");

// SMTP transporter
const transporter = nodemailer.createTransport(mailSmtp);

templatesPath = path.join(__dirname, "../templates/");

// this function will parse variables in html template depend on context variables
const renderTemplate = (filename, context) => {
  try {
    const html = fs.readFileSync(filename, { encoding: "utf-8" });
    const template = compile(html);
    return template(context, {
      allowProtoPropertiesByDefault: true,
    });
  } catch (err) {
    throw err;
  }
};

const sendMail = (mailOptions) => {
  try {
    transporter.sendMail(
      {
        from: "UpTech<abdo.sabani30@gmail.com>",
        to: mailOptions.to,
        subject: mailOptions.subject,
        html: mailOptions.filename
          ? renderTemplate(mailOptions.filename, mailOptions.context)
          : mailOptions.html,
      },
      (err, info) => {
        if (err) throw err;
        console.log(info);
      }
    );
  } catch (err) {
    throw err;
  }
};

chooseTemplate = (template) => {
  return path.join(templatesPath, `${template}.html`);
};

const sendConfirmation = async (user, subject, template) => {
  try {
    let token = await signConfirmationToken(user.userMail);
    user.token_url = `${user.externalURL}/api/v1/auth/confirm_account/${token}`;
    sendMail({
      to: user.userMail,
      subject: subject,
      filename: chooseTemplate(template),
      context: { user },
    });
  } catch (err) {
    throw err;
  }
};

module.exports = { sendConfirmation };
