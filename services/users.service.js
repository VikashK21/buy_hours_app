const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { authenticationToken } = require("../auth/users.auth");
const { sendOTP } = require("../messages/otp.messages");
const crypto = require("crypto");

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
          const sendRes2 = await sendOTP(phone_num, otp);
          console.log(sendRes2);
          if (sendRes2.return) return sendRes2;
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
    } catch (err) {
      return err.message;
    }
  }

  async eidtRecvr(id, data) {
    try {
    } catch (err) {
      return err.message;
    }
  }

  async preVerifyEmail(email) {
    try {
    } catch (err) {
      return err.message;
    }
  }

  async verifyEmail(data) {
    try {
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
