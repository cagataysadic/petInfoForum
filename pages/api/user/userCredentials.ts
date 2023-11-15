import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../utils/database';
import User from '../../../models/User';
import { RequestWithUser, authenticateToken } from '../../../utils/authenticateToken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await authenticateToken(req, res);
        await connectToDatabase();
        const user = await User.findById((req as RequestWithUser).user.userId).select('-password');
        res.status(200).json(user);
    } catch (error) {
        if (!res.headersSent) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
