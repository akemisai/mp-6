import React from 'react';
import styled from 'styled-components';

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

const Button = styled.a`
  padding: 10px 20px;
  background-color: #fff; 
  color: #333; 
  text-decoration: none;
  border-radius: 5px;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #ddd; /* Light grey background on hover */
  }
`;

export default function Home() {
  return (
    <Page>
      <Main>
        <h1>OAuth App</h1>
        <Button
          href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/auth/callback`}
        >
          Login with GitHub
        </Button>
      </Main>
    </Page>
  );
}