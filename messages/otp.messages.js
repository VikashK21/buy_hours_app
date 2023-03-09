const fast2sms = require("fast-two-sms");
require("dotenv").config();
console.log(process.env.SMS_API_KEY);

const sendOTP = async (phone_num, otp) => {
  try {
    const options = {
      authorization: process.env.SMS_API_KEY,
      message: `is ${otp} to verify your account. Do not let others to misuse your details. \n ~ From BTHApp.`,
      numbers: phone_num,
    };
    const res = await fast2sms.sendMessage(options);
    console.log(res);
    return res;
  } catch (err) {
    console.log(err.message);
  }
};

/**
 * response of above....
 * {
  return: true,
  request_id: 'j7a51sfxrloq6tc',
  message: [ 'SMS sent successfully.' ]
}

  2....
{
  return: true,
  request_id: 'ui495gam81rjdeo',
  message: [ 'SMS sent successfully.' ]
}
 */

// sendOTP(["7022720230"], 998877);

module.exports = { sendOTP };
