import express from "express";
import { authorizeJWT } from "../middlewares/authorize.js";
import pageModel from "../models/page.model.js";
import { nanoid } from "nanoid";

export const pageRouter = express.Router();

// Get all pages in a folder
pageRouter.get("/", authorizeJWT, async (req, res) => {
  const { email } = req.headers.user;
  const { folderId } = req.query;

  if (!folderId) {
    return res.status(400).json({ message: "folderId is required" });
  }

  try {
    const pages = await pageModel
      .find({ email, folderId })
      .select("pageId title icon metadata")
      .sort({ "metadata.updatedAt": -1 });
    res.json(pages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch pages" });
  }
});

// Get single page with all blocks
pageRouter.get("/:pageId", authorizeJWT, async (req, res) => {
  const { email } = req.headers.user;
  const { pageId } = req.params;

  try {
    const page = await pageModel.findOne({ email, pageId });
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }
    res.json(page);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch page" });
  }
});

// Create new page
pageRouter.post("/", authorizeJWT, async (req, res) => {
  const { email } = req.headers.user;
  const { folderId, title, icon } = req.body;

  if (!folderId) {
    return res.status(400).json({ message: "folderId is required" });
  }

  try {
    const page = await pageModel.create({
      email,
      pageId: nanoid(),
      folderId,
      title: title || "Untitled",
      icon: icon || "📄",
      blocks: [],
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        lastEditedBy: email,
        favorite: false,
        archived: false,
      },
    });
    res.json(page);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create page" });
  }
});

// Update page (title, icon, cover)
pageRouter.put("/:pageId", authorizeJWT, async (req, res) => {
  const { email } = req.headers.user;
  const { pageId } = req.params;
  const { title, icon, coverImage } = req.body;

  try {
    const updateData = {
      "metadata.updatedAt": new Date(),
      "metadata.lastEditedBy": email,
    };

    if (title !== undefined) updateData.title = title;
    if (icon !== undefined) updateData.icon = icon;
    if (coverImage !== undefined) updateData.coverImage = coverImage;

    const page = await pageModel.findOneAndUpdate(
      { email, pageId },
      updateData,
      { new: true }
    );

    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.json(page);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update page" });
  }
});

// Update blocks (full replace)
pageRouter.put("/:pageId/blocks", authorizeJWT, async (req, res) => {
  const { email } = req.headers.user;
  const { pageId } = req.params;
  const { blocks } = req.body;

  if (!Array.isArray(blocks)) {
    return res.status(400).json({ message: "blocks must be an array" });
  }

  try {
    const page = await pageModel.findOneAndUpdate(
      { email, pageId },
      {
        blocks,
        "metadata.updatedAt": new Date(),
        "metadata.lastEditedBy": email,
      },
      { new: true }
    );

    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.json(page);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update blocks" });
  }
});

// Add single block
pageRouter.post("/:pageId/blocks", authorizeJWT, async (req, res) => {
  const { email } = req.headers.user;
  const { pageId } = req.params;
  const { type, content, properties, order, parentId } = req.body;

  try {
    const newBlock = {
      blockId: nanoid(),
      type,
      content,
      properties: properties || {},
      order,
      parentId: parentId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const page = await pageModel.findOneAndUpdate(
      { email, pageId },
      {
        $push: { blocks: newBlock },
        "metadata.updatedAt": new Date(),
        "metadata.lastEditedBy": email,
      },
      { new: true }
    );

    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.json(newBlock);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to add block" });
  }
});

// Update single block
pageRouter.put("/:pageId/blocks/:blockId", authorizeJWT, async (req, res) => {
  const { email } = req.headers.user;
  const { pageId, blockId } = req.params;
  const { type, content, properties, order } = req.body;

  try {
    const updateFields = {
      "blocks.$.updatedAt": new Date(),
      "metadata.updatedAt": new Date(),
      "metadata.lastEditedBy": email,
    };

    if (type !== undefined) updateFields["blocks.$.type"] = type;
    if (content !== undefined) updateFields["blocks.$.content"] = content;
    if (properties !== undefined)
      updateFields["blocks.$.properties"] = properties;
    if (order !== undefined) updateFields["blocks.$.order"] = order;

    const page = await pageModel.findOneAndUpdate(
      { email, pageId, "blocks.blockId": blockId },
      { $set: updateFields },
      { new: true }
    );

    if (!page) {
      return res.status(404).json({ message: "Page or block not found" });
    }

    const updatedBlock = page.blocks.find((b) => b.blockId === blockId);
    res.json(updatedBlock);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update block" });
  }
});

// Delete single block
pageRouter.delete(
  "/:pageId/blocks/:blockId",
  authorizeJWT,
  async (req, res) => {
    const { email } = req.headers.user;
    const { pageId, blockId } = req.params;

    try {
      const page = await pageModel.findOneAndUpdate(
        { email, pageId },
        {
          $pull: { blocks: { blockId } },
          "metadata.updatedAt": new Date(),
          "metadata.lastEditedBy": email,
        },
        { new: true }
      );

      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }

      res.json({ message: "Block deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to delete block" });
    }
  }
);

// Delete page
pageRouter.delete("/:pageId", authorizeJWT, async (req, res) => {
  const { email } = req.headers.user;
  const { pageId } = req.params;

  try {
    const result = await pageModel.findOneAndDelete({ email, pageId });

    if (!result) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.json({ message: "Page deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete page" });
  }
});

// Favorite/unfavorite page
pageRouter.patch("/:pageId/favorite", authorizeJWT, async (req, res) => {
  const { email } = req.headers.user;
  const { pageId } = req.params;
  const { favorite } = req.body;

  if (typeof favorite !== "boolean") {
    return res.status(400).json({ message: "favorite must be a boolean" });
  }

  try {
    const page = await pageModel.findOneAndUpdate(
      { email, pageId },
      {
        "metadata.favorite": favorite,
        "metadata.updatedAt": new Date(),
      },
      { new: true }
    );

    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.json(page);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update favorite status" });
  }
});

// Archive/unarchive page
pageRouter.patch("/:pageId/archive", authorizeJWT, async (req, res) => {
  const { email } = req.headers.user;
  const { pageId } = req.params;
  const { archived } = req.body;

  if (typeof archived !== "boolean") {
    return res.status(400).json({ message: "archived must be a boolean" });
  }

  try {
    const page = await pageModel.findOneAndUpdate(
      { email, pageId },
      {
        "metadata.archived": archived,
        "metadata.updatedAt": new Date(),
      },
      { new: true }
    );

    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.json(page);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update archive status" });
  }
});
