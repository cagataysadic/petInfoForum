import mongoose, { Schema, Document } from 'mongoose';
import './User';

export interface IPost extends Document {
    postText: string;
    postAnimal: string;
    userId: mongoose.Types.ObjectId;
    createdAt?: Date;
    updateAt?: Date;
}

const PostSchema: Schema = new mongoose.Schema({
    postText: String,
    postAnimal: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

const Post = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;