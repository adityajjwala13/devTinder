const express = require("express");
const app = express();
app.use("/test", (req, res) => res.send("We r here for testing"));
app.use("/hello", (req, res) => res.send("Hello Dude"));
app.listen(7777, () => console.log("Server started listening on port 7777"));
