"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _nodemailer = _interopRequireDefault(require("nodemailer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Créez un routeur Express
var router = (0, _express.Router)(); // Fonction pour envoyer des e-mails

var sendEmail = function sendEmail(_ref) {
  var recipient_email = _ref.recipient_email,
      OTP = _ref.OTP;
  return new Promise(function (resolve, reject) {
    var transporter = _nodemailer["default"].createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MY_EMAIL,
        // Assurez-vous que la variable d'environnement est correctement définie
        pass: process.env.MY_PASSWORD // Assurez-vous que la variable d'environnement est correctement définie

      }
    });

    var mailOptions = {
      from: process.env.MY_EMAIL,
      to: recipient_email,
      subject: 'KODING 101 PASSWORD RECOVERY',
      html: "\n        <!DOCTYPE html>\n        <html lang=\"en\">\n        <head>\n          <meta charset=\"UTF-8\">\n          <title>Password Recovery</title>\n        </head>\n        <body>\n          <div style=\"font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2\">\n            <div style=\"margin:50px auto;width:70%;padding:20px 0\">\n              <div style=\"border-bottom:1px solid #eee\">\n                <a href=\"\" style=\"font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600\">Koding 101</a>\n              </div>\n              <p style=\"font-size:1.1em\">Hi,</p>\n              <p>Thank you for choosing Koding 101. Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 5 minutes</p>\n              <h2 style=\"background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;\">".concat(OTP, "</h2>\n              <p style=\"font-size:0.9em;\">Regards,<br />Koding 101</p>\n              <hr style=\"border:none;border-top:1px solid #eee\" />\n              <div style=\"float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300\">\n                <p>Koding 101 Inc</p>\n                <p>1600 Amphitheatre Parkway</p>\n                <p>California</p>\n              </div>\n            </div>\n          </div>\n        </body>\n        </html>\n      ")
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return reject({
          message: 'An error occurred while sending email.'
        });
      }

      return resolve({
        message: 'Email sent successfully.'
      });
    });
  });
}; // Route pour l'envoi de l'e-mail de réinitialisation de mot de passe


router.post('/send_recovery_email', function (req, res) {
  var _req$body = req.body,
      recipient_email = _req$body.recipient_email,
      OTP = _req$body.OTP;
  sendEmail({
    recipient_email: recipient_email,
    OTP: OTP
  }).then(function (response) {
    return res.send(response.message);
  })["catch"](function (error) {
    return res.status(500).send(error.message);
  });
});
var _default = router;
exports["default"] = _default;