import { NextApiRequest, NextApiResponse } from 'next';
import getMongoClient from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const client = await getMongoClient();
      const db = client.db("QuestionSchema");
      const questions = await db.collection("questions").aggregate([
        { $sample: { size: 20 } }
      ]).toArray();

      res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

      res.status(200).json(questions);
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch questions' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}