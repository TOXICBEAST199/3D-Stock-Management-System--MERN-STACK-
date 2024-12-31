import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const connectdb = async () => {
    console.log(process.env.MONGO_URI,"URL :");
    
    try {
        const conn = await mongoose.connect("mongodb+srv://twopairedelectrons:RajTheBeast199@cluster0.yoidt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected Succesfully!`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

export default connectdb;