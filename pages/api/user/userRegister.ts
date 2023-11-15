import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../utils/database';
import User from '../../../models/User';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectToDatabase();
        const user = new User(req.body);
        await user.save();
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.status(201).send({ user, token });
    } catch (error) {
        let errors = { userName: '', email: '' };

        if (error.code === 11000) {
            
            const duplicateFieldMatch = /index: (\w+)_\d/.exec(error.message);
            if (duplicateFieldMatch) {
                const duplicateField = duplicateFieldMatch[1];
                if (duplicateField === "userName") {
                    errors[duplicateField] = `User name already exists. Please use a different one.`
                } else {
                    errors[duplicateField] = `Email already exists. Please use a different one.`;
                }
            }
        }

        res.status(400).send(errors)
    }
}
