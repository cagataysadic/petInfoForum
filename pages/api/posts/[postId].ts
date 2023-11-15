import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../utils/database';
import Post from '../../../models/Post';
import Comment from '../../../models/Comment';
import { authenticateToken } from '../../../utils/authenticateToken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { query: {postId} } = req;
    if (req.method === "PUT") {
        const { postText, postAnimal } = req.body;
        try {
            await authenticateToken(req, res);
            await connectToDatabase();
            const updatedPost = await Post.findByIdAndUpdate(postId, { postText, postAnimal, updatedAt: Date.now() }, { new: true });
            const populatedUpdatedPost = await Post.findById(updatedPost._id).populate('userId', 'userName');
            res.status(200).json(populatedUpdatedPost);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else if (req.method === "DELETE") {
        try {
            await authenticateToken(req, res);
            await connectToDatabase();
            await Post.findByIdAndDelete(postId);
            await Comment.deleteMany({ postId });
            res.status(200).json({ message: 'Notice deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
