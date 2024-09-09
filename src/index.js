import dotenv from "dotenv";
import connectDB from "./db/mongodb.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`App is listening on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Connection failed with mongodb", err);
  });
