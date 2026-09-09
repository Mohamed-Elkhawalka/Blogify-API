import mongoose from "mongoose";

const connectDB = () => {
mongoose
.connect(process.env.DBConnection)
.then(() => {
console.log("DB connection is start..");
})
.catch((err) => {
console.log("db connection error ", err);
});
};

export default connectDB;
