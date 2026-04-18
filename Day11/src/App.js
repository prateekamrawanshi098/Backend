import  express  from "express";
import authRouter from "./routers/auth.routes.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

app.use("/api/auth",authRouter)
app.use(errorHandler)
export default app;
