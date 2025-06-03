const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.header("Authorization") || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Missing or malformed Authorization header" });
  }

  try {
    // 1. Check if token is blacklisted in Redis
    const isBlacklisted = await redisClient.get(`blacklist_${token}`);
    if (isBlacklisted) {
      return res.status(401).json({ error: "Token has been logged out" });
    }

    // 2. Verify JWT
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach userId to request for downstream use
    req.user = payload.userId;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = authMiddleware;


// const jwt = require("jsonwebtoken");
// const redisClient = require("../utils/redisClient");

// async function authMiddleware(req, res, next) {
//   const authHeader = req.header("Authorization") || "";
//   const [scheme, token] = authHeader.split(" ");

//   if (scheme !== "Bearer" || !token) {
//     return res.status(401).json({ error: "Missing or malformed Authorization header" });
//   }

//   try {
//     // Check if token is blacklisted
//     const isBlacklisted = await redisClient.get(`blacklist_${token}`);
//     if (isBlacklisted) {
//       return res.status(401).json({ error: "Token has been logged out" });
//     }

//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = payload.userId;
//     next();
//   } catch (err) {
//     return res.status(401).json({ error: "Invalid or expired token" });
//   }
// }

// module.exports = authMiddleware;

// const jwt = require("jsonwebtoken");

// function authMiddleware(req, res, next) {
//   const authHeader = req.header("Authorization") || "";
//   const [scheme, token] = authHeader.split(" ");

//   if (scheme !== "Bearer" || !token) {
//     return res.status(401).json({ error: "Missing or malformed Authorization header" });
//   }

//   try {
//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = payload.userId;
//     next();
//   } catch (err) {
//     return res.status(401).json({ error: "Invalid or expired token" });
//   }
// }

// module.exports = authMiddleware;
