import mongoose from "mongoose";

const blockSchema = mongoose.Schema({
  blockId: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: [
      "text",
      "heading1",
      "heading2",
      "heading3",
      "bulletList",
      "numberedList",
      "todo",
      "code",
      "quote",
      "callout",
      "divider",
      "image",
      "video",
      "file",
      "table",
      "embed",
    ],
  },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
  properties: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  order: { type: Number, required: true },
  parentId: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const pageSchema = mongoose.Schema(
  {
    email: { type: String, required: true, index: true },
    pageId: { type: String, required: true, unique: true, index: true },
    folderId: { type: String, required: true, index: true },
    title: { type: String, default: "Untitled" },
    icon: { type: String, default: "📄" },
    coverImage: { type: String, default: null },
    blocks: [blockSchema],
    metadata: {
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
      lastEditedBy: { type: String },
      favorite: { type: Boolean, default: false },
      archived: { type: Boolean, default: false },
    },
  },
  {
    collection: "Page",
    timestamps: true,
  }
);

// Text search index for search functionality
pageSchema.index({
  title: "text",
  "blocks.content": "text",
});

// Compound index for faster queries
pageSchema.index({ email: 1, folderId: 1 });

const pageModel = mongoose.model("pageModel", pageSchema);
export default pageModel;
