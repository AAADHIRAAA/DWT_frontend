"use client"
import React from 'react';
import Header from "../components/Header";
import Image from 'next/image';
import UserDashboard from "../userdashboard/page";
import DataForm from "../components/dataform";
import { useRouter } from 'next/navigation';
import {  useClerk } from '@clerk/nextjs';
import { useState } from 'react';

export default function WorkReport() {
  const [logoutTime, setLogoutTime] = useState(null);
  const router = useRouter();
  const { signOut } = useClerk();

  const handleLogout = async() => {
    const currentTime = new Date().toISOString();
    setLogoutTime(currentTime); // Store logout time locally
    
    try {
      await signOut();
      // Redirect the user to the desired page after logout
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
      // Handle error during logout if needed
    }
  
    
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth', 
    });
  };
  return (
    <>
    <Header/>
    <button onClick={handleLogout} className="ml-4 bg-sky-800 hover:bg-sky-600 text-white  py-2 px-4 rounded">End the day</button>
    <div className='ml-4 text-sky-800'>{logoutTime && <p>Logout Time: {logoutTime}</p>}</div>
      <main className="flex flex-col items-center justify-between ">
          <div >
           <UserDashboard />
              
            <DataForm />
           
          </div>
        
        <button  onClick={scrollToBottom} className="bg-sky-800 hover:bg-sky-600 text-white py-1 px-1 rounded fixed bottom-10 right-2">
        <Image src="/scroll-down.png" alt="Scrolldown" width={20} height={20} />
        </button>
       
        
      </main>
  
    </>
  )
}