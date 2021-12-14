import mongoose from "mongoose";

const connectDatabase = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,

      useUnifiedTopology: true,
    })

    .then(() => {
      console.log("mongodb connection successful");
    })
    .catch((err) => {
      console.error(err);
    });
};

export { connectDatabase };
