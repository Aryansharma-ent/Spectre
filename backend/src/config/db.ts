import mongoose from "mongoose";

const connectDB = async() : Promise<void> => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL as string)

        console.log(`Mongo DB connected : ${conn.connection.host}`)
    } catch (error) {
        console.log("MongoDB failed")
        process.exit(1)
    }
}

export default connectDB