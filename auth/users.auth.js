const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

/**
 * The openssl method to create the private and public keys
 * private.pem -->  openssl genrsa -out private_key.pem 4096
 * public.pem -->   openssl rsa -pubout -in private_key.pem -out public_key.pem
 */
// /home/vikash/Desktop/BASK/black_box/auth/keys/private_key.pem
const SECRET_KEY_TOKEN = fs.readFileSync(
  path.join(__dirname, "../keys/private_key.pem"),
  "utf8",
);
const PUBLIC_KEY_TOKEN = fs.readFileSync(
  path.join(__dirname, "../keys/public_key.pem"),
  "utf8",
);
// console.log(SECRET_KEY_TOKEN);
// console.log(PUBLIC_KEY_TOKEN)

const authenticationToken = async (data) => {
  try {
    console.log("Private_Key: ", SECRET_KEY_TOKEN);
    const result = jwt.sign(data, SECRET_KEY_TOKEN, {
      issuer: "blackboxlive.com",
      subject: "buyers_buy_the_hours'",
      audience: "https://www.blackboxlive.com",
      // expiresIn: exp,
      algorithm: "RS256",
    });
    console.log("Token: ", result);
    return result;
  } catch (err) {
    console.log(err.message);
  }
};

const authorizationToken = async (req, res, next) => {
  try {
    const cookie = req.headers.authorization;
    if (!cookie) return res.status(403).send("Token not found!!");
    let token = cookie.split(" ")[1];
    if (token) {
      const decodedToken = jwt.verify(token, PUBLIC_KEY_TOKEN, {
        issuer: "blackboxlive.com",
        subject: "buyers_buy_the_hours'",
        audience: "https://www.blackboxlive.com",
        // expiresIn: exp,
        algorithm: ["RS256"],
      });
      if (decodedToken) {
        req.user_id = Number(decodedToken.id);
      } else {
        return res.status(403).send("Token not recognized!!");
      }
      next();
    } else {
      return res.status(401).send("Login first to proceed!!");
    }
  } catch (err) {
    res.status(400).json(err.message);
  }
};


module.exports = {
  authenticationToken,
  authorizationToken,
};
