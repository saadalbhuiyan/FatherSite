import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: null,
  },
}, { timestamps: true });

export default mongoose.model('Contact', contactSchema);
