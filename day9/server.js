
require("dotenv").config()
const server = require("./src/App")
const connectToDB = require("./src/config/database")

connectToDB()
server.listen(3000, () => {
  console.log("Server is running on port 3000")
})
