const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const sessionId = req.header("sessionid");  // Extract sessionId from headers
  const userId = req.header("userid");  // Extract userId from headers

  if (!sessionId || !userId) {
    return res.status(401).json({ message: "No session or user ID, authorization denied" });
  }

  try {
    // Verify sessionId (session token)
    const decoded = jwt.verify(sessionId, process.env.JWT_SECRET);
    req.user = { userId, sessionId: decoded.user };  // Attach user info to req.user
    next();
  } catch (err) {
    return res.status(401).json({ message: "Session is not valid" });
  }
};
