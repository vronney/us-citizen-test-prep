import { NextApiRequest, NextApiResponse } from 'next';
import getMongoClient from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { email, correctAnswers, totalQuestions } = req.body;
      const client = await getMongoClient();
      const db = client.db("UserProgressSchema");
      
      await db.collection("userProgress").updateOne(
        { email },
        { $inc: { correctAnswers, totalQuestions } },
        { upsert: true }
      );

      res.status(200).json({ message: 'Progress saved successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Unable to save progress' });
    }
  } else if (req.method === 'GET') {
    try {
      const { email } = req.query;
      const client = await getMongoClient();
      const db = client.db("UserProgressSchema");
      
      const progress = await db.collection("userProgress").findOne({ email });

      res.status(200).json(progress || { correctAnswers: 0, totalQuestions: 0 });
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch progress' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}