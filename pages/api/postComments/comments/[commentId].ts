import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../../utils/database';
import { authenticateToken } from '../../../../utils/authenticateToken';
import Comment from '../../../../models/Comment';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { commentId } = req.query
    if (req.method === 'PUT') {
        try {
          const { commentText } = req.body;
          await authenticateToken(req, res);
          await connectToDatabase();
          const updatedComment = await Comment.findByIdAndUpdate(commentId, { commentText, updatedAt: Date.now() }, { new: true });
          const populatedUpdatedComment = await Comment.findById(updatedComment._id).populate('userId', 'userName');
          res.status(200).json(populatedUpdatedComment);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
    } else if (req.method === 'DELETE') {
        await authenticateToken(req, res);
        await connectToDatabase();
        try {
            await Comment.findByIdAndDelete(commentId);
            res.status(200).json({ message: 'Comment deleted succesfully' });
          } catch (error) {
            res.status(500).json({ message: error.message });
          }
    }
    
}
