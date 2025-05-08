import mongoose from 'mongoose';

const tipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  likes: { type: Number, default: 0 }
});

export default mongoose.models.Tip || mongoose.model('Tip', tipSchema);
