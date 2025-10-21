import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const authorizeJWT = async (req, res, next) => {
  const JWT_SECRET = process.env.JWT_SECRET;

  // Get token from Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      authenticated: false,
      message: "Unauthorized Access, provide JWT Token",
    });
  }

  try {
    // Extract token from "Bearer <token>"
    const jwtToken = authHeader.split(" ")[1];

    try {
      const payload = jwt.verify(jwtToken, JWT_SECRET);
      const data = await User.findOne({ email: payload.email });

      if (!data) {
        return res.status(404).json({
          authenticated: false,
          message: "User not found",
        });
      }

      req.headers.user = { name: data.name, email: data.email };
      next();
    } catch (error) {
      console.log(error);
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          authenticated: false,
          message: "JWT Token expired",
        });
      }

      return res.status(401).json({
        authenticated: false,
        message: "Invalid token",
      });
    }
  } catch (error) {
    res.status(400).json({
      authenticated: false,
      message: error.message,
    });
    console.log(error);
  }
};
