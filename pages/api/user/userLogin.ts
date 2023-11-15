import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../utils/database';
import User from '../../../models/User';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectToDatabase();
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password);
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.status(200).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
}
