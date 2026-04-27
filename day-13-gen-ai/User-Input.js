import "dotenv/config";
import readline from "readline";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage } from "@langchain/core/messages";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const model = new ChatMistralAI({
  model: "mistral-small-latest",
  temperature: 0,
});

const messages=[]

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function main() {
  try {
      while (true) {
        const name = await askQuestion("You : ");

        messages.push(new HumanMessage(name))

        const response = await model.invoke(messages);

        messages.push(response)

        console.log(response.content);
   }
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    rl.close();
  }
}

await main();
