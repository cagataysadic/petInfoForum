import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../utils/database';
import User from '../../../models/User';
import Post from '../../../models/Post';
import Comment from '../../../models/Comment';
import { RequestWithUser, authenticateToken } from '../../../utils/authenticateToken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const deleteRelatedData = async (userId: any) => {
        await Post.deleteMany({ userId });
        await Comment.deleteMany({ userId });
    };
    try {
        await authenticateToken(req, res);
        await connectToDatabase();
        const user = await User.findById((req as RequestWithUser).user.userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
          }
        await deleteRelatedData((req as RequestWithUser).user.userId);
        await User.findByIdAndDelete((req as RequestWithUser).user.userId);
        res.send({ message: 'User and related data deleted successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Server error' });
    }
}
