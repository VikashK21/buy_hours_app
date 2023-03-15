const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { authenticationToken } = require("../auth/users.auth");
const { sendOTP } = require("../messages/otp.messages");
const crypto = require("crypto");
const { send_OTP } = require("../messages/otp.emails");

class usersModel {
  async preLogin(phone_num) {
    try {
      const exist = await prisma.users.findUnique({
        where: { phone_num },
      });
      const otp = crypto.randomInt(100000, 999999);
      const errMsg = "Something went wrong with the otp sending step!!";
      if (exist) {
        const sendRes = await sendOTP([phone_num], otp);
        console.log(sendRes);
        if (sendRes.return) {
          const setOTP = await prisma.users.update({
            where: { phone_num },
            data: { otp },
          });
          if (setOTP) return sendRes;
        }
        return errMsg;
      } else {
        const createUser = await prisma.users.create({
          data: { phone_num, otp },
        });
        console.log(createUser);
        if (createUser) {
          const sendRes2 = await sendOTP([phone_num], otp);
          console.log(sendRes2);
          if (sendRes2 && sendRes2.return) return sendRes2;
          return errMsg;
        }
        return createUser;
      }
    } catch (err) {
      return err.message;
    }
  }

  async login(data) {
    try {
      const takngOtp = await prisma.users.findUnique({
        where: { phone_num: data.phone_num },
        include: {
          Profession: true,
        },
      });
      if (takngOtp && takngOtp.otp === Number(data.otp)) {
        const result = await prisma.users.update({
          where: { id: takngOtp.id },
          data: { otp: 0 },
        });
        const token = await authenticationToken(result);
        console.log(result, "the data");
        let signup = false;
        if (result && (!result.name || result.name.length === 0)) {
          signup = true;
        }
        return { result: takngOtp, token, signup };
      }
      return "OTP did not match!!";
    } catch (err) {
      return err.message;
    }
  }

  async signupProvdr(id, data) {
    try {
      if (data.hasOwnProperty("phone_num")) {
        return "phone_num is already taken!";
      }
      const addDetails = await prisma.users.update({
        where: { id },
        data,
      });
      return addDetails;
    } catch (err) {
      return err.message;
    }
  }

  async signupRecvr(id, data) {
    try {
      if (data.basic.hasOwnProperty("phone_num")) {
        return "phone_num is already taken!";
      }
      const basicDetails = await prisma.users.update({
        where: { id },
        data: { ...data.basic, pro: false },
      });
      if (basicDetails) {
        const proffDetails = await prisma.profession.create({
          data: { ...data.proff, user_id: id },
        });
        return { ...basicDetails, Profession: proffDetails };
      }
      return basicDetails;
    } catch (err) {
      return err.message;
    }
  }

  async editProvdr(id, data) {
    try {
      const updateD = await prisma.users.update({
        where: { id },
        data,
      });
      return updateD;
    } catch (err) {
      return err.message;
    }
  }

  async eidtRecvr(id, data) {
    try {
      const bringD = await prisma.users.findUnique({
        where: { id },
        include: {
          Profession: true,
        },
      });
      const updatePro = await prisma.users.update({
        where: { id },
        data: { ...data.basic },
      });
      console.log(bringD.Profession[0].id);

      if (bringD.Profession.length > 0) {
        const proffID = bringD.Profession[0].id;
        const updateRec = await prisma.profession.update({
          where: { id: proffID },
          data: { ...data.proff },
        });
        return { basic: updatePro, proff: updateRec };
      }
      return "Details are not of profession!";
    } catch (err) {
      return err.message;
    }
  }

  async preVerifyEmail(id, email) {
    try {
      const exist = await prisma.users.findUnique({
        where: { id },
      });
      console.log(exist, 'came till here');
      const otp = crypto.randomInt(100000, 999999);
      if ((exist && exist.email === email) || (exist && !exist.email)) {
        send_OTP(email, otp);
        await prisma.users.update({
          where: { id },
          data: { email, otp },
        });
        return { status: true };
      }
      return { status: false, msg: "Email did not match" };
    } catch (err) {
      return err.message;
    }
  }

  async verifyEmail(data) {
    try {
      const bringD = await prisma.users.findUnique({
        where: { email: data.email },
      });
      if (bringD && bringD.otp === Number(data.otp)) {
        const checkoutOTP = await prisma.users.update({
          where: { id: bringD.id },
          data: { otp: 0, verified: true },
        });
        return checkoutOTP;
      }
      return "Email or OTP does not match!!";
    } catch (err) {
      return err.message;
    }
  }

  async getProvdr(id) {
    try {
      const proUser = await prisma.users.findUnique({
        where: { id },
        include: {
          Booked: true,
        },
      });
      return proUser;
    } catch (err) {
      return err.message;
    }
  }

  async getRecvr(id) {
    try {
      const recUser = await prisma.users.findUnique({
        where: { id },
        include: {
          Profession: true,
          Booked: true,
        },
      });
      return recUser;
    } catch (err) {
      return err.message;
    }
  }

  async allProvdrs() {
    try {
      const allPros = await prisma.users.findMany({
        where: { pro: true },
        include: { Booked: true },
      });
      return allPros;
    } catch (err) {
      return err.message;
    }
  }

  async allRecvrs() {
    try {
      const allRecs = await prisma.users.findMany({
        where: { pro: false },
        include: {
          Profession: true,
          Booked: true,
        },
      });
      return allRecs;
    } catch (err) {
      return err.message;
    }
  }
}

// const initial = new usersModel();
// initial.preLogin("1234567890");
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

module.exports = usersModel;
