const admin = require("../firebase/firebaseAdmin");

const authenticateFirebaseToken = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  admin
    .auth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      req.firebaseUid = decodedToken.uid;
      next();
    })
    .catch(() => {
      res.status(401).json({ error: "Unauthorized" });
    });
};

module.exports = authenticateFirebaseToken;