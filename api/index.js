import checkin from "./checkin.js";
import getPoints from "./getPoints.js";
import getEvents from "./getEvents.js";
import cors from "cors";

const express = require("express");
const app = express();

app.use(
  cors({
    origin: "https://www.claid.org", // Allow requests from this specific origin
  })
);
app.use(express.json());
app.use("/checkin", checkin);
app.use("/getPoints", getPoints);
app.use("/getEvents", getEvents);
app.get("/", (req, res) => res.send("CLAID Express server!"));

app.listen(5051, () => console.log("Server ready on port 5151."));

module.exports = app;
