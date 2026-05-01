import { tavily as Tavily } from "@tavily/core";

const tavily = Tavily({
  apiKey: process.env.TRAVILY_API_KEY,
});

export async function internetsearch(query) {
    return await tavily.search(query, {
        maxResults: 5,
        searchDepth:"advanced"
    })
}

