const router = require("express").Router();
const usersCtrl = new (require("../controller/users.ctrl"))();
const { authorizationToken } = require("../auth/users.auth");

router.get("/", async (req, res) => {
  try {
    res.status(200).send("You are at users page.");
  } catch (err) {
    res.status(400).json(err.message);
  }
});

router.post("/login", usersCtrl.login); // 2 steps first phone_num and phone_num + otp
router.post("/signup/:provider", authorizationToken, usersCtrl.signup); // provider is boolean value

router.patch("/edit/prefession", authorizationToken, usersCtrl.eidtRecvr); // user id
router.patch("/edit/account", authorizationToken, usersCtrl.editProvdr); // user id
router.patch("/verify/email", authorizationToken, usersCtrl.verifyEmail); // 2 steps first email and email + otp

router.get("/users", usersCtrl.allProvdrs); // all users
router.get("/users/:id", authorizationToken, usersCtrl.provdrById); // user by id
router.get("/professionals", usersCtrl.allRecvrs); // all professionals
router.get("/professionals/:id", authorizationToken, usersCtrl.recvrById); // professional by id
router.get("/profile", authorizationToken, usersCtrl.profile);

router.delete("/user/:id", usersCtrl.deleteU);

module.exports = router;
