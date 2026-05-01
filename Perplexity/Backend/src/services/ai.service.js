import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from "@langchain/core/messages";
import { ChatMistralAI } from "@langchain/mistralai";
import { tool } from "@langchain/core/tools";
import * as z from "zod";
import { internetsearch } from "./internet.service.js";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

// ================= MODELS =================
const geminaiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

// ================= TOOL =================
const InternetSearchTool = tool(internetsearch, {
  name: "InternetSearchTool",
  description: `
Use this tool for:
- latest news
- current date/time
- recent updates

Always use this tool if query includes: today, latest, current, now, news
`,
  schema: z.object({
    query: z.string(),
  }),
});

// ================= PROMPT =================
const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a real-time AI assistant.

RULES:
- Use InternetSearchTool for latest or real-time queries.
- Never guess current information.
- Answer clearly and concisely.`,
  ],
  new MessagesPlaceholder("chat_history"),
  ["human", "{input}"],
  new MessagesPlaceholder("agent_scratchpad"),
]);

// ================= AGENT =================
const agent = await createToolCallingAgent({
  llm: geminaiModel,
  tools: [InternetSearchTool],
  prompt,
});

const agentExecutor = new AgentExecutor({
  agent,
  tools: [InternetSearchTool],
});

// ================= HELPERS =================
function needsRealTime(query) {
  const keywords = [
    "today",
    "latest",
    "current",
    "now",
    "recent",
    "news",
    "date",
    "time",
  ];
  return keywords.some((word) => query.toLowerCase().includes(word));
}

function formatSearchResult(result) {
  if (typeof result === "string") return result;

  if (result?.results) {
    return result.results
      .map((r, i) => `🔹 ${r.title}\n${r.content}`)
      .join("\n\n");
  }

  return JSON.stringify(result);
}

// ================= TITLE =================
export async function generateChatTitle(message) {
  const res = await mistralModel.invoke([
    new SystemMessage("Generate a short 2-4 word title."),
    new HumanMessage(message),
  ]);
  return res.content;
}

// ================= MAIN AI =================
export async function AIResponse(messages) {
  const formattedMessages = messages
    .map((msg) => {
      if (!msg || !msg.role || !msg.content) return null;

      const role = msg.role.toLowerCase();

      if (role === "user") return new HumanMessage(msg.content);
      if (role === "ai" || role === "assistant")
        return new AIMessage(msg.content);

      return null;
    })
    .filter(Boolean);

  if (formattedMessages.length === 0) {
    return "No valid messages.";
  }

  const latestMessage = formattedMessages[formattedMessages.length - 1];
  const chatHistory = formattedMessages.slice(0, -1);

  // ================= REAL-TIME (FORCED SEARCH) =================
  if (needsRealTime(latestMessage.content)) {
    const raw = await internetsearch(latestMessage.content);

    const summary = await mistralModel.invoke([
      new SystemMessage(`
You are a smart assistant.

RULES:
- Give clean, short, accurate answers
- Follow user instruction strictly (like "3-5 words", "only numbers")
- Do NOT include extra explanation
- Do NOT include sources unless asked
    `),

      new HumanMessage(`
User Query: ${latestMessage.content}

Search Data:
${JSON.stringify(raw)}

Give final answer:
    `),
    ]);

    return summary.content;
  }

  // ================= GEMINI + FALLBACK =================
  try {
    const response = await agentExecutor.invoke({
      input: latestMessage.content,
      chat_history: chatHistory,
    });

    return response.output;
  } catch (err) {
    console.log("Gemini failed → fallback to Mistral");

    try {
      const fallback = await mistralModel.invoke([
        new SystemMessage("You are a helpful assistant."),
        new HumanMessage(latestMessage.content),
      ]);

      return fallback.content;
    } catch (fallbackErr) {
      console.error("Fallback also failed:", fallbackErr);
      return "Something went wrong. Please try again later.";
    }
  }
}
