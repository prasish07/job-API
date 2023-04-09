require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

//connectDB
const connectDB = require("./db/connect");
//routers
const authRouter = require("./routes/auth");
const jobRouter = require("./routes/jobs");
const authentication = require("./middleware/authentication");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const port = process.env.PORT || 5000;

app.use(express.json());
// extra packages

app.get("/", (req, res) => {
  res.send('<h1>jobs API</h1> <a href ="/api-docs">Documentation</a>');
});
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authentication, jobRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
