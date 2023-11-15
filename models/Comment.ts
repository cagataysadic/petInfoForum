import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  commentText: string;
  userId: mongoose.Schema.Types.ObjectId,
  postId: mongoose.Schema.Types.ObjectId,
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new mongoose.Schema({
  commentText: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

const Comment = mongoose.models.Comment || mongoose.model<IComment>('Comment', commentSchema);

export default Comment;
