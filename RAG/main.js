import "dotenv/config";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MistralAIEmbeddings, ChatMistralAI } from "@langchain/mistralai";
import { Pinecone } from "@pinecone-database/pinecone";

async function run() {
  // =========================
  // 1. LOAD PDF
  // =========================
  const loader = new PDFLoader("./P_cv.pdf");
  const docs = await loader.load();

  // =========================
  // 2. SPLIT TEXT
  // =========================
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });

  const splitDocs = await splitter.splitDocuments(docs);

  // =========================
  // 3. EMBEDDINGS
  // =========================
  const embeddings = new MistralAIEmbeddings({
    apiKey: process.env.MISTRAL_API_KEY,
    model: "mistral-embed",
  });

  // =========================
  // 4. PINECONE SETUP
  // =========================
  const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });

  const index = pc.index("cohort-rag");

  // =========================
  // 5. STORE IN PINECONE
  // =========================
  const texts = splitDocs.map((doc) => doc.pageContent);

  // 🔥 single batch call (no rate limit)
  const vectorsData = await embeddings.embedDocuments(texts);

  const vectors = vectorsData.map((vec, i) => ({
    id: `doc-${i}`,
    values: vec,
    metadata: {
      text: texts[i],
    },
  }));

  await index.upsert(vectors);
  console.log("✅ Data stored in Pinecone");

  // =========================
  // 6. QUERY
  // =========================
  const query = "What is my name";

  const queryEmbedding = await embeddings.embedQuery(query);

  const results = await index.query({
    vector: queryEmbedding,
    topK: 3,
    includeMetadata: true,
  });

  // =========================
  // 7. EXTRACT CONTEXT
  // =========================
  const context = results.matches
    .map((match) => match.metadata.text)
    .join("\n");

  console.log("📄 Retrieved Context:\n", context);

  // =========================
  // 8. LLM RESPONSE
  // =========================
  const llm = new ChatMistralAI({
    apiKey: process.env.MISTRAL_API_KEY,
  });

  const prompt = `
You are a helpful assistant.
Answer clearly based ONLY on the given context.

Context:
${context}

Question: ${query}
`;

  const response = await llm.invoke(prompt);

  console.log("\n🤖 Answer:\n", response.content);
}

run();
