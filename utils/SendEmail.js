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

async function sendEmail(to, otp) {
  try {

    const oAuth2Client = new OAuth2Client(
      mailClientId,
      mailClientSecret,
      OAUTH_PLAYGROUND
    );

    oAuth2Client.setCredentials({ refresh_token: mailRefreshToken });

    const access_token = await oAuth2Client.getAccessToken();
    console.log(access_token)
    const transporter =await  createTransporter(access_token);
    console.log({transporter})
    const message = {
      from: process.env.EMAIL_USERNAME,
      to,
      subject: "Team mates Rest Password",
      html: `
         <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
         <div style="margin:50px auto;width:70%;padding:20px 0">
           <div style="border-bottom:1px solid #eee">
             <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Team mates</a>
           </div>
           <p style="font-size:1.1em">Hi,</p>
           <p>We have received a request to reset your account password. To proceed with the password reset, please use the following One-Time Password (OTP):</p>
           <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
           <p>Please note that the OTP is valid for a limited time, typically 1 hours. If the OTP expires, you will need to initiate the password recovery process again.</p>
           <p>If you did not request a password reset or believe this email was sent to you by mistake, please disregard this message. Your account security is important to us, and we advise you to monitor your account for any suspicious activity.</>
           <p>If you require any further assistance, please don't hesitate to reach out to our support team at [Support Email] or visit our help center at [Help Center URL].</p>
           <p style="font-size:0.9em;">Regards,<br />Team mates</p>
           <hr style="border:none;border-top:1px solid #eee" />
           <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
             <p>Team mates Inc</p>
             <p>1600 Amphitheatre Parkway</p>
             <p>California</p>
           </div>
         </div>
       </div>
               `,
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

module.exports = sendEmail;