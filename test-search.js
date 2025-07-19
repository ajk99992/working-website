// test-search.js
require('dotenv').config();
const { OpenAI } = require('openai');
const { ChromaClient } = require('chromadb');
const path = require('path');



const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const client = new ChromaClient({ path: 'http://localhost:8000' });


async function getEmbedding(text) {
  const response = await openai.embeddings.create({
    input: text,
    model: "text-embedding-ada-002", // Use the same model you used during indexing
  });

  return response.data[0].embedding;
}

async function testSearch() {
  try {
    const collectionName = 'chatbot_docs'; // CHANGE this to your actual collection name
    const testQuery = 'who is techies?'; // CHANGE this to any test question

    const embedding = await getEmbedding(testQuery);

    const collection = await client.getOrCreateCollection({ name: collectionName });

    const results = await collection.query({
      queryEmbeddings: [embedding],
      nResults: 3,
      include: ["documents", "distances", "metadatas"]
    });

    console.log("\n📦 ChromaDB Search Results:");
    console.dir(results, { depth: null });

  } catch (error) {
    console.error("❌ Error during test search:", error);
  }
}


const collections = await client.listCollections();
console.log("Available collections:", collections);

const myCollection = await client.getCollection({ name: "chatbot_docs" });
const docs = await myCollection.get();
console.log("Stored documents:", docs);


testSearch();
