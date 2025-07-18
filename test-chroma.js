import { ChromaClient } from 'chromadb';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const client = new ChromaClient();

async function getEmbedding(text) {
  const res = await openai.embeddings.create({
    model: 'text-embedding-3-small', // or 'text-embedding-ada-002'
    input: text,
  });
  return res.data[0].embedding;
}

const run = async () => {
  const collection = await client.getOrCreateCollection({ name: 'my-first-collection' });

  const text = 'hello world';
  const embedding = await getEmbedding(text);

  await collection.add({
    ids: ['1'],
    documents: [text],
    embeddings: [embedding],
  });

  const result = await collection.get({ ids: ['1'], include: ['documents', 'embeddings'] });
  console.log(JSON.stringify(result, null, 2));
};

run();
