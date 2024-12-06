import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await response.json();
  const accessToken = data.access_token;

  const userResponse = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${accessToken}`,
    },
  });

  const user = await userResponse.json();

  const emailResponse = await fetch('https://api.github.com/user/emails', {
    headers: {
      Authorization: `token ${accessToken}`,
    },
  });

  const emails = await emailResponse.json();
  console.log('Emails response:', emails);

  const primaryEmail = Array.isArray(emails) ? emails.find((email: any) => email.primary)?.email : null;

  const client = await MongoClient.connect(process.env.MONGODB_URI as string);

  const db = client.db();
  await db.collection('users').updateOne(
    { githubId: user.id },
    { $set: { githubId: user.id, username: user.login, name: user.name, email: primaryEmail, avatar_url: user.avatar_url } },
    { upsert: true }
  );

  client.close();

  const userData = {
    githubId: user.id,
    username: user.login,
    name: user.name,
    email: primaryEmail,
    avatar_url: user.avatar_url,
  };

  res.setHeader('Set-Cookie', `auth=${JSON.stringify(userData)}; Path=/; HttpOnly; Max-Age=${60 * 60 * 24}`);

  res.redirect(`/profile`);
}