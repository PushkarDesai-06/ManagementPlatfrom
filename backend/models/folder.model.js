import mongoose from "mongoose";

const folderSchema = mongoose.Schema(
  {
    email: { type: String, required: true },
    folders: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
      },
    ],
  },
  { collection: "Folder" }
);

const folderModel = mongoose.model("folderModel", folderSchema);
export default folderModel;
