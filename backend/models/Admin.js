import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    otp: String,
    otpExpiresAt: Date,
    isVerified: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Admin', adminSchema);