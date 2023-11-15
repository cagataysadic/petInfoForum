import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../utils/database';
import { authenticateToken } from '../../../utils/authenticateToken';
import Comment from '../../../models/Comment';
import User from '../../../models/User';
import { RequestWithUser } from '../../../utils/authenticateToken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { postId } = req.query
    if (req.method === 'GET') {
        try {
            await connectToDatabase();
            const comments = await Comment.find({ postId }).populate('userId', 'userName').select('commentText userId createdAt updatedAt');
            res.status(200).json(comments);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else if (req.method === 'POST') {
        try {
            const { commentText } = req.body;
            await authenticateToken(req, res);
            await connectToDatabase();
            const user = await User.findById((req as RequestWithUser).user.userId);
            const comment = new Comment({ commentText, userName: user.userName, createdAt: Date.now(), userId: (req as RequestWithUser).user.userId, postId });
            const newComment = await comment.save();
            const populatedComment = await Comment.findById(newComment._id).populate('userId', 'userName');
            res.status(201).json(populatedComment);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    
}
