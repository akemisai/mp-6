import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Image from 'next/image';

interface User {
  username: string;
  name: string;
  avatar_url: string;
}

const Page = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #333;
  color: #fff; 
  font-family: Arial, sans-serif;
`;

const Main = styled.main`
  text-align: center;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #fff;
  color: #333; 
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #ddd; 
  }
`;

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch('/api/auth/user');
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        router.push('/');
      }
    }
    fetchUser();
  }, [router]);

  if (!user) return <div>Loading...</div>;

  return (
    <Page>
      <Main>
        <h1>Profile</h1>
        <Image src={user.avatar_url} alt="Profile Picture" width={150} height={150} style={{ borderRadius: '50%' }} />
        <p>Name: {user.name}</p>
        <p>Username: {user.username}</p>
        <p>Signed in with: GitHub</p>
        <Button
          onClick={() => {
            document.cookie = 'auth=; Max-Age=0; path=/';
            router.push('/');
          }}
        >
          Sign Out
        </Button>
      </Main>
    </Page>
  );
}