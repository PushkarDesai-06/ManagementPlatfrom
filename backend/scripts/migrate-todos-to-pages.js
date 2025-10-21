import "dotenv/config";
import connectDb from "../db.js";
import todoModel from "../models/todos.model.js";
import pageModel from "../models/page.model.js";
import { nanoid } from "nanoid";

/**
 * Migration Script: Convert Todos to Pages
 *
 * This script migrates existing todo documents to the new page-based system.
 * Each todo list becomes a page with todo-type blocks.
 *
 * Usage: node scripts/migrate-todos-to-pages.js
 */

async function migrateTodos() {
  console.log("🚀 Starting migration from todos to pages...\n");

  try {
    // Connect to database
    await connectDb(process.env.DB_URL);
    console.log("✅ Connected to database\n");

    // Get all todo documents
    const allTodos = await todoModel.find({});
    console.log(`📋 Found ${allTodos.length} todo documents to migrate\n`);

    if (allTodos.length === 0) {
      console.log("✨ No todos to migrate. Exiting...");
      process.exit(0);
    }

    let migratedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const todoDoc of allTodos) {
      try {
        // Check if page already exists for this folder/user
        const existingPage = await pageModel.findOne({
          email: todoDoc.email,
          folderId: todoDoc.folderId,
          title: "Migrated Todos",
        });

        if (existingPage) {
          console.log(
            `⏭️  Skipping: Page already exists for ${todoDoc.email} in folder ${todoDoc.folderId}`
          );
          skippedCount++;
          continue;
        }

        // Convert todos to blocks
        const blocks = todoDoc.todos.map((todo, index) => ({
          blockId: nanoid(),
          type: "todo",
          content: {
            text: todo.content,
            html: `<p>${todo.content}</p>`,
          },
          properties: {
            checked: todo.status === "completed" || todo.status === "done",
          },
          order: index,
          parentId: null,
          createdAt: todo.createdAt || new Date(),
          updatedAt: new Date(),
        }));

        // Create new page
        const newPage = await pageModel.create({
          email: todoDoc.email,
          pageId: nanoid(),
          folderId: todoDoc.folderId,
          title: "Migrated Todos",
          icon: "✅",
          blocks,
          metadata: {
            createdAt: todoDoc.createdAt || new Date(),
            updatedAt: new Date(),
            lastEditedBy: todoDoc.email,
            favorite: false,
            archived: false,
          },
        });

        console.log(
          `✅ Migrated: ${todoDoc.email} - ${blocks.length} todos → page ${newPage.pageId}`
        );
        migratedCount++;
      } catch (error) {
        console.error(
          `❌ Error migrating todos for ${todoDoc.email}:`,
          error.message
        );
        errorCount++;
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log("📊 Migration Summary:");
    console.log("=".repeat(60));
    console.log(`✅ Successfully migrated: ${migratedCount}`);
    console.log(`⏭️  Skipped (already exists): ${skippedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📝 Total processed: ${allTodos.length}`);
    console.log("=".repeat(60));

    if (errorCount === 0) {
      console.log("\n🎉 Migration completed successfully!");
      console.log("\n💡 Next steps:");
      console.log("   1. Test the new pages in your app");
      console.log("   2. Verify all data migrated correctly");
      console.log(
        "   3. Once confirmed, you can optionally delete old todo documents"
      );
      console.log(
        "   4. To delete old todos: Run 'node scripts/cleanup-old-todos.js'"
      );
    } else {
      console.log(
        "\n⚠️  Migration completed with errors. Please review the logs above."
      );
    }
  } catch (error) {
    console.error("\n❌ Fatal error during migration:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run migration
migrateTodos();
