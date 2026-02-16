require("dotenv").config();
const app = require("./src/App");

const connectToDb = require("./src/config");

connectToDb();

app.listen(3000, () => {
  console.log("server started on port 3000");
});


