const nodemailer = require("nodemailer");

function createTransporter() {
  // Create and return a Nodemailer transporter with your email service provider details
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    service:"Gmail",
    port: 587,
    secure: true,
    // requireTLS: true,
    logger: true,
    debug: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    }
  });
}

async function sendEmail(to, otp) {
  try {
    const transporter = createTransporter();
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
    const info = await transporter.sendMail(message);
    console.log('Email sent:', info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

module.exports = sendEmail;