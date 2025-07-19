require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const { ChromaClient } = require('chromadb');
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getEmbedding(text) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return response.data[0].embedding;
}

async function createAndSeedCollection(docxFilePath) {
  try {
    // 1. Extract text from docx
    const buffer = fs.readFileSync(docxFilePath);
    const result = await mammoth.extractRawText({ buffer });
    const fullText = result.value.trim();

    if (!fullText) {
      console.error("No text found in document.");
      return;
    }

    // Optional: Split text into smaller chunks (paragraphs)
    const chunks = fullText.split('\n').filter(p => p.trim().length > 20);

    // 2. Initialize Chroma client & collection
    const client = new ChromaClient({ path: 'http://localhost:8000' }); // Connects to local Chroma server at default
    const collection = await client.getOrCreateCollection({ name: 'chatbot_docs' });

    // 3. Generate embeddings for each chunk
    const embeddings = [];
    for (const chunk of chunks) {
      embeddings.push(await getEmbedding(chunk));
    }

    // 4. Add to collection
    await collection.add({
      ids: chunks.map((_, i) => `doc_${i + 1}`),
      documents: chunks,
      embeddings: embeddings,
      metadatas: chunks.map(() => ({ source: path.basename(docxFilePath) })),
    });

    console.log(`✅ Added ${chunks.length} chunks to collection.`);
  } catch (err) {
    console.error("Error seeding collection:", err);
  }
}

// Usage - replace with your file name
createAndSeedCollection('./Techies_AI_Chatbot_Overview.docx');
