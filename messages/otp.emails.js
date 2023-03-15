const nodemailer = require("nodemailer");

const transpoter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "blackboxcreative42@gmail.com",
    pass: "bcbnvyguitidvkme",
  },
});

const send_OTP = (email, otp) => {
  const mailOptions = {
    from: "blackboxcreative42@gmail.com",
    to: email,
    subject: `${otp} is email verification OTP from Buyers Buy Hours App`,
    html: `Hey,<div>
    <h4>
        We recieved a request to verify your email. Enter the following OTP to verify the email.<br/>
        <strong>${otp}</strong> <br/><br/>
        If you did not make this request, please don't share this OTP to anyone.
    </h4>
    
    </div> <br/>
    ~ Thank you from the Saviers of Buyers Buy Hours App.`,
  };
  transpoter.sendMail(mailOptions, (err, info) => {
    if (err) throw err;
    else {
      console.log(info);
    }
  });
  // return true;
};

// send_OTP("vikash21@navgurukul.org", 435345);
module.exports = { send_OTP };
