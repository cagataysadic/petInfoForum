import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../utils/database';
import User from '../../../models/User';
import { RequestWithUser, authenticateToken } from '../../../utils/authenticateToken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await authenticateToken(req, res);
        await connectToDatabase();
        const user = await User.findById((req as RequestWithUser).user.userId);
        if (!user) {
            return res.status(404);
        }
        const isMatch = await user.comparePassword(req.body.currentPassword);
        if (!isMatch) {
            return res.status(400).send({ error: 'Current password is incorrect.' });
        }
        res.send({ isValid: true })
    } catch (error) {
        if (!res.headersSent) {
            res.status(400).send(error);
        }
    }
}
