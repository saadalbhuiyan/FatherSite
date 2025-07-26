import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema({
    description: { type: String, required: true },
    imageUrl: { type: String, required: true, default: null }
}, { timestamps: true });

export default mongoose.model("About", aboutSchema);