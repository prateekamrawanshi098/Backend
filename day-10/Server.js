const app = require("./src/App");
const connectToDB = require("./src/Config/database");
const db = require("./src/Config/database");

connectToDB()

app.listen(3000, ()=> {
    console.log("Server stated on port number 3000");
    
})

