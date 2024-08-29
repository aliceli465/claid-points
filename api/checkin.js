import express from "express";

// This will help us connect to the database
import { connectToDB } from "./db.js";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /users.
const router = express.Router();

router.use(express.json());
// Route to update a user and create the user if they do not exist
router.patch("/", async (req, res) => {
  try {
    const db = await connectToDB();
    const eventCode = req.body.eventCode; // Assuming eventCode is sent in the body
    const userEmail = req.body.email;

    // Check if the event exists in the "events" collection
    let eventCollection = db.collection("events");
    let event = await eventCollection.findOne({ eventCode: eventCode });

    if (!event) {
      return res.status(404).send("Event not found");
    }

    let userCollection = db.collection("users");
    let user = await userCollection.findOne({ email: userEmail });
    if (!user) {
      // User does not exist, create a new user
      console.log("user does not exist");
      let newUser = {
        email: userEmail,
        points: event.points,
        events: [eventCode],
      };

      let createUserResult = await userCollection.insertOne(newUser);

      if (!createUserResult.insertedId) {
        return res.status(500).send("Error creating new user");
      }
      return res.status(200).send("New user created successfully");
    } else {
      if (user.events.includes(eventCode)) {
        return res.status(400).send("Already checked in");
      }
      const updates = {
        $inc: {
          points: event.points,
        },
        $push: {
          events: eventCode, // Append the eventCode to the events array
        },
      };
      let updateResult = await userCollection.updateOne(
        { email: userEmail },
        updates
      );

      return res
        .status(200)
        .send("Existing user's points updated successfully");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error updating user");
  }
});

export default router;
