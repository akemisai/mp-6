import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { auth } = req.cookies;

  if (!auth) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const user = JSON.parse(auth);
    console.log('User from cookie:', user);

    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();
    const dbUser = await db.collection('users').findOne({ githubId: user.githubId });

    client.close();

    if (!dbUser) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    console.log('User from MongoDB:', dbUser);

    res.status(200).json({ username: dbUser.username, name: dbUser.name, avatar_url: dbUser.avatar_url });
  } catch (error) {
    console.error('Error in user handler:', error);
    res.status(401).json({ error: 'Not authenticated' });
  }
}