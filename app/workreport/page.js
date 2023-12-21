"use client"
import React from 'react';
import Header from "../components/Header";
import Image from 'next/image';
import UserDashboard from "../userdashboard/page";
import DataForm from "../components/dataform";


export default function WorkReport() {


  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth', 
    });
  };



  return (
    <>
    <Header/>
  
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