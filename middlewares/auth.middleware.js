const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

module.exports.Auth = async (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ error: "no token provided" });
  }

  const decodedData = jwt.verify(token, JWT_SECRET);
  req.user = decodedData;

  if (req.body.data) {
    try {
      req.body = JSON.parse(req.body.data);
    } catch (parseError) {
      console.log({ parseError });
      return res.status(400).json({ error: "Invalid JSON in request body" });
    }
  }

  console.info("<------------Authentication--------->");
  console.info({ token, decodedData });
  console.info("<----------------End---------------->");

  next();
};
