import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URL);
    // console.log(connectionInstance);
    console.log(
      `MongoDB database Connected !! DB Host : ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("Error while connecting DB :- ", error);
    process.exit(1);
  }
};

export default connectDB;