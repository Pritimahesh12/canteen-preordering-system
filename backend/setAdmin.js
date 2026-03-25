import mongoose from "mongoose";
import userModel from "./models/userModel.js";

await mongoose.connect('mongodb+srv://pritimahesh52_db_user:UOaP4oCBvXWFXLN2@canteen-db.9c05j3a.mongodb.net/dyp-cafeteria');

await userModel.findOneAndUpdate(
    { email: "priti@gmail.com" }, 
    { isAdmin: true }
);

console.log("Admin set!");
await mongoose.disconnect();
