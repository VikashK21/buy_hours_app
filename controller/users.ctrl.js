const usersModel = new (require("../services/users.service"))();

class usersCtrl {
  login = async (req, res) => {
    try {
      const data = req.body;
      if (!data.phone_num || !data.phone_num.length === 10) {
        return res.status(400).json("phone_num is required of 10 characters!");
      }
      if (data.hasOwnProperty("otp")) {
        const result = await usersModel.login(data);
        if (typeof result === "object") {
          return res.status(200).json(result);
        }
        return res.status(400).json(result);
      } else {
        const result2 = await usersModel.preLogin(data.phone_num);
        if (typeof result2 === "object") {
          return res.status(200).json(result2);
        }
        return res.status(400).json(result2);
      }
    } catch (err) {
      res.status(400).json(err.message);
    }
  };

  signup = async (req, res) => {
    try {
      const pro = JSON.parse(req.params.provider);
      const data = req.body;
      console.log(req.user_id, "id___");
      console.log(pro, "prov___", JSON.parse(pro));
      if (pro) {
        const result = await usersModel.signupProvdr(Number(req.user_id), data);
        if (typeof result === "object") {
          return res.status(200).json(result);
        }
        return res.status(400).json(result);
      } else if (data.hasOwnProperty("basic") && data.hasOwnProperty("proff")) {
        const result2 = await usersModel.signupRecvr(Number(req.user_id), data);
        if (typeof result2 === "object") {
          return res.status(200).json(result2);
        }
        return res.status(400).json(result2);
      } else {
        return res
          .status(400)
          .json("Please try again with suitable crendentials type!");
      }
    } catch (err) {
      res.status(400).json(err.message);
    }
  };

  editProvdr = async (req, res) => {
    try {
      const data = req.body;
      const result = await usersModel.editProvdr(Number(req.user_id), data);
      if (typeof result === "object") {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (err) {
      res.status(400).json(err.message);
    }
  };

  eidtRecvr = async (req, res) => {
    try {
      const data = req.body;
      console.log(req.user_id, "id___");
      if (data.hasOwnProperty("basic") && data.hasOwnProperty("proff")) {
        const result = await usersModel.eidtRecvr(Number(req.user_id), data);
        if (typeof result === "object") {
          return res.status(200).json(result);
        }
        return res.status(400).json(result);
      } else {
        return res
          .status(400)
          .json("Please try again with suitable crendentials type!");
      }
    } catch (err) {
      res.status(400).json(err.message);
    }
  };

  verifyEmail = async (req, res) => {
    try {
      const data = req.body;
      if (data.hasOwnProperty("otp") && data.hasOwnProperty("email")) {
        console.log("or here");
        const result = await usersModel.verifyEmail(data);
        if (typeof result === "object") {
          return res.status(200).json(result);
        } else {
          return res.status(400).JSON(result);
        }
      } else if (data.hasOwnProperty("email")) {
        console.log("is it here");
        const result = await usersModel.preVerifyEmail(
          Number(req.user_id),
          data.email,
        );
        if (typeof result === "object") {
          return res.status(200).json(result);
        } else {
          return res.status(400).json(result);
        }
      }
    } catch (err) {
      res.status(400).json(err.message);
    }
  };

  allProvdrs = async (req, res) => {
    try {
      const result = await usersModel.allProvdrs();
      if (typeof result === "object") {
        return res.status(200).json(result);
      }
      return res.status(400).json(result);
    } catch (err) {
      res.status(400).json(err.message);
    }
  };

  allRecvrs = async (req, res) => {
    try {
      const result = await usersModel.allRecvrs();
      if (typeof result === "object") {
        return res.status(200).json(result);
      }
      return res.status(400).json(result);
    } catch (err) {
      res.status(400).json(err.message);
    }
  };

  provdrById = async (req, res) => {
    try {
      const result = await usersModel.getProvdr(Number(req.user_id));
      if (typeof result === "object") {
        return res.status(200).json(result);
      }
      return res.status(400).json(result);
    } catch (err) {
      res.status(400).json(err.message);
    }
  };

  recvrById = async (req, res) => {
    try {
      const result = await usersModel.getRecvr(Number(req.user_id));
      if (typeof result === "object") {
        return res.status(200).json(result);
      }
      return res.status(400).json(result);
    } catch (err) {
      res.status(400).json(err.message);
    }
  };
}

module.exports = usersCtrl;
