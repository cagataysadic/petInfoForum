import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../utils/database';
import Animal from '../../models/Animal';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
      await connectToDatabase();
      const animals = await Animal.find();
      res.status(200).json(animals);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
}
