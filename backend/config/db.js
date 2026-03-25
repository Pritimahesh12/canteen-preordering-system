import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(
            'mongodb+srv://pritimahesh52_db_user:UOaP4oCBvXWFXLN2@canteen-db.9c05j3a.mongodb.net/dyp-cafeteria'
        );
        console.log("MongoDB Connected Successfully");

    } catch (error) {
        console.log(" MongoDB Connection Failed");
        console.log(error);
    }
}

export default connectDB;