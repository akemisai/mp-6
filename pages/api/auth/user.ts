import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { auth } = req.cookies;

  if (!auth) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const user = JSON.parse(auth);
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);

    const db = client.db();
    const dbUser = await db.collection('users').findOne({ githubId: user.githubId });

    client.close();

    if (!dbUser) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    res.status(200).json({ username: dbUser.username, name: dbUser.name, email: dbUser.email, avatar_url: dbUser.avatar_url });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Not authenticated' });
  }
}
