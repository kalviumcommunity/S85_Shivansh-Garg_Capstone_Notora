const jwt = require("jsonwebtoken");
const User = require("../models/User");
const tokenStore = require("../utils/tokenStore");

const authMiddleware = async (req, res, next) => {
  try {
    console.log("Auth middleware - Request headers:", {
      authorization: req.header("Authorization") ? "Present" : "Missing",
      origin: req.headers.origin,
      path: req.path
    });

    const authHeader = req.header("Authorization") || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      console.log("Invalid authorization header format");
      return res.status(401).json({ error: "No token, authorization denied" });
    }

    // Check if token is blacklisted
    const isBlacklisted = await tokenStore.get(`blacklist_${token}`);
    if (isBlacklisted) {
      console.log("Token is blacklisted");
      return res.status(401).json({ error: "Token has been invalidated" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token decoded successfully:", {
        id: decoded.id,
        iat: decoded.iat,
        exp: decoded.exp
      });

      const user = await User.findById(decoded.id);
      if (!user) {
        console.log("User not found for ID:", decoded.id);
        return res.status(401).json({ error: "User not found" });
      }

      console.log("User authenticated:", {
        id: user._id,
        name: user.name,
        role: user.role
      });

      req.user = user._id;
      next();
    } catch (err) {
      console.error("Token verification error:", err);
      res.status(401).json({ error: "Token is not valid" });
    }
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ error: "Token is not valid" });
  }
};

module.exports = { authMiddleware };


// const jwt = require("jsonwebtoken");

// async function authMiddleware(req, res, next) {
//   const authHeader = req.header("Authorization") || "";
//   const [scheme, token] = authHeader.split(" ");

//   if (scheme !== "Bearer" || !token) {
//     return res.status(401).json({ error: "Missing or malformed Authorization header" });
//   }

//   try {
//     // 1. Check if token is blacklisted in Redis
//     const isBlacklisted = await redisClient.get(`blacklist_${token}`);
//     if (isBlacklisted) {
//       return res.status(401).json({ error: "Token has been logged out" });
//     }

//     // 2. Verify JWT
//     const payload = jwt.verify(token, process.env.JWT_SECRET);

//     // 3. Attach userId to request
//     req.user = payload.userId;

//     next();
//   } catch (err) {
//     return res.status(401).json({ error: "Invalid or expired token" });
//   }
// }

// module.exports = { authMiddleware };


// const jwt = require("jsonwebtoken");

// async function authMiddleware(req, res, next) {
//   const authHeader = req.header("Authorization") || "";
//   const [scheme, token] = authHeader.split(" ");

//   if (scheme !== "Bearer" || !token) {
//     return res.status(401).json({ error: "Missing or malformed Authorization header" });
//   }

//   try {
//     // 1. Check if token is blacklisted in Redis
//     const isBlacklisted = await redisClient.get(`blacklist_${token}`);
//     if (isBlacklisted) {
//       return res.status(401).json({ error: "Token has been logged out" });
//     }

//     // 2. Verify JWT
//     const payload = jwt.verify(token, process.env.JWT_SECRET);

//     // 3. Attach userId to request for downstream use
//     req.user = payload.userId;

//     next();
//   } catch (err) {
//     return res.status(401).json({ error: "Invalid or expired token" });
//   }
// }

// module.exports = authMiddleware;


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



// yoo can u see this