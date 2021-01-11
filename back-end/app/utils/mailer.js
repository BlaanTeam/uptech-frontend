const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const { compile } = require("handlebars");
const { mailSmtp } = require("../config/config");
const { signConfirmationToken, signForgotPassword } = require("../utils/jwt");

// SMTP transporter
const transporter = nodemailer.createTransport(mailSmtp);

// templates path
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

// this function will send an email to target specified in mailOptions
const sendMail = (mailOptions) => {
    try {
        transporter.sendMail(
            {
                from: `UpTech<${process.env.MAIL_SMTP_SENDER}>`,
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

// this function will choose the template from templates
chooseTemplate = (template) => {
    return path.join(templatesPath, `${template}.html`);
};

// this function will send  confirmation request to user mail
const sendConfirmation = async (user, subject) => {
    try {
        let token = await signConfirmationToken(user.userMail);
        user.token_url = `${user.externalURL}/confirm_account/${token}`;
        sendMail({
            to: user.userMail,
            subject: subject,
            filename: chooseTemplate("confirmAccount"),
            context: { user },
        });
    } catch (err) {
        throw err;
    }
};

// this function will send reset password request to user mail
const sendForgotPassword = async (user, subject) => {
    try {
        let token = await signForgotPassword(user.userMail);
        user.token_url = `${user.externalURL}/reset_password/${token}`;
        sendMail({
            to: user.userMail,
            subject: subject,
            filename: chooseTemplate("forgotPassword"),
            context: { user },
        });
    } catch (err) {
        throw err;
    }
};

module.exports = { sendConfirmation, sendForgotPassword };
