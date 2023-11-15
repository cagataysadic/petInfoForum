import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../utils/database';
import Post from '../../../models/Post';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectToDatabase();
        const posts = await Post.find().populate('userId', 'userName')
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).send(error);
    }
}
