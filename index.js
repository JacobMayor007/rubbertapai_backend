require("dotenv").config();
const express = require("express");
const routes = require("./routing/index");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use("/", routes);

app.listen(port, () => {
  console.log(`Listening on PORT ${port}`);
});
