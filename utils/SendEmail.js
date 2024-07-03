const nodemailer = require('nodemailer');
const { OAuth2Client } = require("google-auth-library")

const mailClientId = process.env.MAIL_CLIENT_ID;
const mailClientSecret = process.env.MAIL_CLIENT_SECRET;
const mailRefreshToken = process.env.MAIL_REFRESH_TOKEN;
const senderEmailAddress = process.env.SENDER_EMAIL_ADDRESS;
const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";

async function createTransporter(access_token) {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: senderEmailAddress,
      clientId: mailClientId,
      clientSecret: mailClientSecret,
      refreshToken: mailRefreshToken,
      access_token,
    },
  });
}

async function sendEmail(to, otp,type) {
  try {

    const oAuth2Client = new OAuth2Client(
      mailClientId,
      mailClientSecret,
      OAUTH_PLAYGROUND
    );
    
    let data={
      otp,
      supportEmail:senderEmailAddress
    }

    oAuth2Client.setCredentials({ refresh_token: mailRefreshToken });

    const access_token = await oAuth2Client.getAccessToken();
    console.log(access_token)
    const transporter =await  createTransporter(access_token);
    console.log({transporter})
    const message = {
        from: `Kuba <${process.env.EMAIL_USERNAME}>`,
      to,
      subject: "Kuba",
      html: getEmailTemplate(type,data)
    };
    transporter?.sendMail(message,function(error, info) {
      if (error) {
        console.error(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    // console.log('Email sent:', info.response);
    // return info;
  } catch (error) {
    console.log({...error})
    // console.error('Error sending email:', error);
    throw error;
  }
}


function getEmailTemplate(type, data) {
  const { otp,supportEmail } = data;

  switch (type) {
    case 'accountActivation':
      return `
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Activate Your Account</title>
      <style>
        body { font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
        .email-container { background-color: #ffffff; width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
        .otp { font-size: 24px; font-weight: bold; color: #333; letter-spacing: 3px; }
        h1, p { color: #333333; }
        .footer { font-size: 12px; color: #777; text-align: center; margin-top: 20px; }
        .border {border-bottom:1px solid #eee}
        .name {font-size:1.6em;color: #00466a;text-decoration:none;font-weight:600}
      </style>
      </head>
      <body>
      <div class="email-container">
          <div class="border">
              <a href="" class="name">Kuba</a>
            </div>
        <h1>Account Activation</h1>
        <p>Hi there,</p>
        <p>Welcome! Please use the following One-Time Password (OTP) to activate your account:</p>
        <div class="otp">${otp}</div>
        <p>This OTP is valid for only 2 minutes. Please enter this OTP in the provided field to complete your registration process.</p>
        <p>If you did not create an account, no further action is required.</p>
        <p class="border">Thank you,<br>Your Team <br> </p>
        <div class="footer">
          <p>For questions, please contact ${supportEmail}</p>
        </div>
      </div>
      </body>
      </html>
      `;
    case 'forgotPassword':
        return `
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Activate Your Account</title>
        <style>
          body { font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
          .email-container { background-color: #ffffff; width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
          .otp { font-size: 24px; font-weight: bold; color: #333; letter-spacing: 3px; }
          h1, p { color: #333333; }
          .footer { font-size: 12px; color: #777; text-align: center; margin-top: 20px; }
          .border {border-bottom:1px solid #eee}
          .name {font-size:1.6em;color: #00466a;text-decoration:none;font-weight:600}
        </style>
        </head>
        <body>
        <div class="email-container">
        <h1>Password Reset Request</h1>
        <p>Hi there,</p>
        <p>You have requested to reset your password. Please use the following One-Time Password (OTP) to proceed with resetting your password:</p>
        <div class="otp">${otp}</div>
        <p>This OTP is valid for only 2 minutes. Please do not share this OTP with anyone.</p>
        <p>If you did not request this, please ignore this email or contact our support team.</p>
        <p>Thank you,<br>Your Team</p>
          <div class="footer">
            <p>For questions, please contact ${supportEmail}</p>
          </div>
        </div>
        </body>
        </html>
        `;
    case 'resendOTP':
          return `
          <html lang="en">
          <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Resend OTP</title>
          <style>
            body { font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
            .email-container { background-color: #ffffff; width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            .otp { font-size: 24px; font-weight: bold; color: #333; letter-spacing: 3px; }
            h1, p { color: #333333; }
            .footer { font-size: 12px; color: #777; text-align: center; margin-top: 20px; }
            .border {border-bottom:1px solid #eee}
            .name {font-size:1.6em;color: #00466a;text-decoration:none;font-weight:600}
          </style>
          </head>
          <body>
          <div class="email-container">
          <h1>Resend OTP</h1>
          <p>Hi there,</p>
          <p>As requested, here is your new One-Time Password (OTP) to proceed:</p>
          <div class="otp">${otp}</div>
          <p>Please use this OTP within 2 minutes. Do not share this OTP with anyone.</p>
          <p>If you did not request this, please ignore this email or contact our support team immediately.</p>
          <p>Thank you,<br>Your Team</p>
            <div class="footer">
              <p>For questions, please contact ${supportEmail}</p>
            </div>
          </div>
          </body>
          </html>
          `;
    default:
      return `
        <html>
        <body>
          <h1>Hello!</h1>
          <p>This is a default email, your content will appear here.</p>
        </body>
        </html>
      `;
  }
}

module.exports = sendEmail;