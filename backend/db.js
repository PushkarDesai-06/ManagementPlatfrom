import mongoose from "mongoose";

const connectDb = async (DbUrl) => {
  return mongoose
    .connect(DbUrl)
    .then(() => {
      console.log("Connected to Database");
    })
    .catch((err) => {
      console.log(err);
    });
};

export default connectDb;
