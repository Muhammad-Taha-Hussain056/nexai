const jwt = require("jsonwebtoken");

function verifyJwt(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  console.log("authHeader", req.headers);
  console.log("scheme", scheme);
  console.log("token", token);

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Unauthorized: missing token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: invalid token" });
  }
}

module.exports = verifyJwt;
