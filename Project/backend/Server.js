require("dotenv").config()
const app = require("./src/App")
const connectToDB=require("./src/config/Database")

app.listen(3000, () => {
    console.log("Server started on port 3000");
})

connectToDB()