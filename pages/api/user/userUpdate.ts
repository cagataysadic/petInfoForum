import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../utils/database';
import User from '../../../models/User';
import { RequestWithUser, authenticateToken } from '../../../utils/authenticateToken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await authenticateToken(req, res);
        await connectToDatabase();
        const { userName, email, password } = req.body;
        let user = await User.findById((req as RequestWithUser).user.userId);
        if (!user) {
            return res.status(404);
        }
        if ( !userName && !email && !password) return res.status(200).send(user)
        if (userName) user.userName = userName;
        if (email) user.email = email;
        if (password) user.password = password;
        await user.save();
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
}
