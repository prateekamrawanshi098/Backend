import "dotenv/config";
import readline from "readline";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage } from "@langchain/core/messages";
import * as z from "zod";
import { tool } from "@langchain/core/tools";
import { createToolCallingAgent, AgentExecutor } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { sendEmail } from "./mail.service.js";

const sendEmailTool = tool(sendEmail, {
  name: "email_sender",
  description: "used to send email",
  schema: z.object({
    to: z.string().email().describe("The recipient email address"),
    html: z.string().describe("This is for html content"),
    subject: z.string().describe("The subject of the mail"),
  }),
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const model = new ChatMistralAI({
  model: "mistral-small-latest",
  temperature: 0,
});

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant. Use tools when needed."],
  ["human", "{input}"],
  ["placeholder", "{agent_scratchpad}"],
]);

const agent = createToolCallingAgent({
  llm: model,
  tools: [sendEmailTool],
  prompt,
});

const agentExecutor = new AgentExecutor({
  agent,
  tools: [sendEmailTool],
});

const messages = [];

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function main() {
  try {
    while (true) {
      const name = await askQuestion("You : ");

      messages.push(new HumanMessage(name));

      const response = await agentExecutor.invoke({
        input: name,
      });

      

      console.log(response.output);
    }
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    rl.close();
  }
}

await main();
