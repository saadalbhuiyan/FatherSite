import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
    image: { type: String, default: null },
    description: { type: String, required: true }
} , {timestamps : true});

export default mongoose.model("Contact", ContactSchema);