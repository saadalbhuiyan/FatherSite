import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  content: {
    type: String, 
    required: true
  },
  image: {
    type: String,
    default: null
  }
}, { timestamps: true });

export default mongoose.model('Blog', blogSchema);
