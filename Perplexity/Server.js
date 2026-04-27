import "dotenv/config";

import app from "./src/App.js";
import connectToDatabase from "./src/config/Database.js";
import { testAi } from "./src/services/ai.service.js";

connectToDatabase();

app.listen(3000, () => {
  console.log("server started on port 3000");
});

testAi()