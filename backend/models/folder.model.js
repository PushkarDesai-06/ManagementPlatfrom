import mongoose from "mongoose";

const folderSchema = mongoose.Schema(
  {
    email: { type: String, required: true },
    folders: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { collection: "Folder" }
);

const folderModel = mongoose.model("folderModel", folderSchema);
export default folderModel;
