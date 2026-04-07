require('dotenv').config()
const app = require("./src/App")
const db=require("./src/config/Database")

db();

app.listen(3000, () => {
    console.log("Server started on port 3000");
    
})
