import mongoose from 'mongoose';

const journalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: { type: String },
  location: { type: String },
  tags: [{ type: String }],
  //  imageUrl: { type:String },
  author: {
    name: { type: String },
    avatar: { type: String },
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },  // Link to the user
  date: { type: Date, default: Date.now },
sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
,
});

export default mongoose.model('Journal', journalSchema);
