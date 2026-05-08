import { START, END, Annotation, StateGraph } from "@langchain/langgraph";
import { z } from "zod";
import { mistralModel, cohereModel, geminiModel } from "./model.ai.js";

// 1. Define the Judge schema
const JudgeSchema = z.object({
  solution_1_score: z.number().default(0),
  solution_2_score: z.number().default(0),
  solution_1_reasoning: z.string().default(""),
  solution_2_reasoning: z.string().default(""),
});

// 2. Create the Root Annotation
export const GraphState = Annotation.Root({
  problem: Annotation<string>(),

  solution_1: Annotation<string>({
    // 'value' is the reducer. (prev, next) => next simply overwrites the old value.
    value: (x, y) => y,
    default: () => "",
  }),

  solution_2: Annotation<string>({
    value: (x, y) => y,
    default: () => "",
  }),

  judge: Annotation<z.infer<typeof JudgeSchema>>({
    value: (x, y) => y,
    default: () => JudgeSchema.parse({}),
  }),
});

// 3. Initialize your graph

const solutionNode = async (state: typeof GraphState.State) => {
  console.log("Starting solution");

  const [mistralResponse, cohereResponse] = await Promise.all([
    mistralModel.invoke(state.problem),
    cohereModel.invoke(state.problem),
  ]);

  console.log("solution generated");

  return {
    solution_1: mistralResponse.content.toString(),
    solution_2: cohereResponse.content.toString(),
  };
};

const judgeModel = geminiModel.withStructuredOutput(JudgeSchema);

const judgeNode = async (state: typeof GraphState.State) => {
  
  console.log("starting judge node");

  const response = await judgeModel.invoke(`
    Compare these two solutions.

    Problem:
    ${state.problem}

    Solution 1:
    ${state.solution_1}

    Solution 2:
    ${state.solution_2}

    Give scores out of 10 with reasoning.
  `);

  console.log("judge complete");

  return {
    judge: response,
  };
};

const application = new StateGraph(GraphState)

  .addNode("solution_node", solutionNode)

  .addNode("judge_node", judgeNode)

  .addEdge(START, "solution_node")

  .addEdge("solution_node", "judge_node")

  .addEdge("judge_node", END)

  .compile();

export default async function runGraph(problem: string) {
  const result = await application.invoke({
    problem: problem,
  });
  return result;
}
