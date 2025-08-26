// import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const authorizeJWT = async (req, res, next) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!req.headers.authorization) {
    res.status(401).json({ message: "Unauthorized Access, provide JWT Token" });
    return;
  }

  try {
    const jwtToken = req.headers.authorization.split(" ")[1];

    const payload = jwt.verify(jwtToken, JWT_SECRET);
    // console.log(payload);
    // if (Date.now() >= payload.exp) {
    //   res.status(401).json({
    //     // status: 401,
    //     authenticated: false,
    //     message: "JTW Token expired",
    //   });
    // }

    const data = await User.findOne({ email: payload.email });
    // console.log(data);

    if (!data) res.status(404).json({ message: "User Not found" });
    req.headers.user = { name: data.name, email: data.email };
    next();
  } catch (error) {
    res.status(400).json({ message: error });
    console.log(error);
  }
};
