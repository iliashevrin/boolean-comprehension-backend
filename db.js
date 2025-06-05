import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URL,

      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      }
    );
    console.log("MongoDB connection SUCCESS");
  } catch (err) {
    console.log(err);
    console.error("MongoDB connection FAIL");
    process.exit(1);
  }
};

export default connectDB;
