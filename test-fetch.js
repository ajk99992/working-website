// delete-collection.js (CommonJS)
const { ChromaClient } = require("chromadb");

async function deleteCollection() {
  const client = new ChromaClient();

  try {
    await client.deleteCollection({ name: "chatbot_docs" });
    console.log("✅ Collection 'chatbot_docs' deleted successfully.");
  } catch (err) {
    console.error("❌ Failed to delete collection:", err);
  }
}

deleteCollection();
