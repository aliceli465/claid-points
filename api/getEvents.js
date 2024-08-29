import express from "express";

// This will help us connect to the database
import { connectToDB } from "./db.js";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /users.
const router = express.Router();

// Route to update a user and create the user if they do not exist
router.get("/", async (req, res) => {
  try {
    const db = await connectToDB();
    const userEmail = req.query.email;

    let userCollection = db.collection("users");
    let user = await userCollection.findOne({ email: userEmail });

    if (!user) {
      return res.status(401).send("User not found");
    }

    const eventCodes = user.events || [];

    if (eventCodes.length === 0) {
      return res.status(200).json({ eventNames: [] });
    }

    let eventsCollection = db.collection("events");
    let events = await eventsCollection
      .find({ eventCode: { $in: eventCodes } })
      .toArray();

    const eventNames = events.map((event) => event.name);

    return res.status(200).json({ eventNames });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error getting points for user");
  }
});

export default router;
