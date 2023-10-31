'use client'
import React from 'react';
import './page.css';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const handleClick = () => {
    router.push('/find');
  }
  return (
    <main className='main'>
      <div className='titleContainer'>
        <h1 className='title'>Welcome to Codeforces Mashup Creator</h1>
      </div>
      <button onClick={handleClick}>Find Problems for your mashup</button>
    </main>
  );
}
