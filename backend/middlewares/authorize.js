import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const authorizeJWT = async (req, res, next) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!req.cookies.token) {
    return res
      .status(401)
      .json({ message: "Unauthorized Access, provide JWT Token" });
  }

  try {
    const jwtToken = req.cookies.token;
    try {
      const payload = jwt.verify(jwtToken, JWT_SECRET);
      const data = await User.findOne({ email: payload.email });
      if (!data) res.status(404).json({ message: "User Not found" });
      req.headers.user = { name: data.name, email: data.email };
      next();
    } catch (error) {
      console.log(error);
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          authenticated: false,
          message: "JTW Token expired",
        });
      }

      return res.status(401).json({
        authenticated: false,
        message: "Server Error, Please try again later.",
      });
    }
  } catch (error) {
    res.status(400).json({ message: error });
    console.log(error);
  }
};
