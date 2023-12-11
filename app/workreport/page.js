"use client"
import React from 'react';
import Header from "../components/Header";
import Image from 'next/image';
import UserDashboard from "../userdashboard/page";
import DataForm from "../components/dataform";
import { useRouter } from 'next/navigation';
import {  useClerk,useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

export default function WorkReport() {
  const [logoutTime, setLogoutTime] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [issues, setIssues] = useState('');
  const {  user } = useUser();
  const [userId, setUserId] = useState(null);
  const router = useRouter();
  const { signOut } = useClerk();

  useEffect(() => {
    
    if (user) {
      setUserId(user.id);
      console.log('User ID:', user.id);
    }
  }, [user,userId]);

  const handleLogout = async() => {
    
    const confirmation = window.confirm('Are you sure to end the day?  This will end the day');
    const getTimeString = (date) => {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    };
    if (confirmation) {
      const currentTime = new Date();
      const timeString = getTimeString(currentTime);
      setLogoutTime(timeString); 
      setShowModal(true);
      
    }
  };

  const handleIssuesSubmit = async () => {
    if (issues.trim() === '') {
      alert('Please enter your issues before submitting.');
    } 
    else {
      
      try {
     
      const response = await fetch('https://digitized-work-tracker-backend.vercel.app/api/v1/users/issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({userId, logoutTime, issues }),
      });

      if (response.ok) {
        await signOut();
 
        router.push('/');
      } else {
        console.error('Failed to store issues and logout time');
     
      }
    } catch (error) {
      console.error('Error:', error);
 
    }
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
    {showModal && (
        <div >
          <div className='mr-4 ml-8'>
       
            <h1 className='text-sky-800 mt-4'>Enter any issues:</h1>
            <textarea value={issues} className='border border-gray-300 p-2 rounded-md  h-24 mt-2 focus:outline-none focus:border-sky-500 text-sky-800' 
            placeholder="Enter your issues here..."
            onChange={(e) => setIssues(e.target.value)} />
            <button onClick={handleIssuesSubmit} className='border border-gray-300 p-2 rounded-md  h-15 ml-2 bg-sky-800 text-white'>Submit</button>
          </div>
        </div>
      )}
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