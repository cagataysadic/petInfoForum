import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../utils/database';
import Post from '../../../models/Post';
import { RequestWithUser, authenticateToken } from '../../../utils/authenticateToken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await authenticateToken(req, res);
        await connectToDatabase();
        console.log(req.body);
        const {postText, postAnimal } = req.body;
        const post = new Post({ postText, postAnimal, createdAt: Date.now(), userId: (req as RequestWithUser).user.userId });
        const newPost = await post.save();
        const populatedPost = await Post.findById(newPost._id).populate('userId', 'userName');
        res.status(201).json(populatedPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
