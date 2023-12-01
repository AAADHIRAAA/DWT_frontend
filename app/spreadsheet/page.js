"use client"
import React from 'react';
import Spreadsheet from '../components/spreadsheet';
import Header from "../components/Header";
import Image from 'next/image';

export default function Home() {
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth', 
    });
  };
  return (
    <>
    <Header/>
    <div>
      
      <Spreadsheet />
        <div>
        <button  onClick={scrollToBottom} className="bg-sky-800 hover:bg-sky-600 text-white font-semibold py-1 px-1 rounded fixed bottom-10 right-2">
        <Image src="/scroll-down.png" alt="Scrolldown" width={20} height={20} />
        </button>
        </div>
   

    </div>
    </>
  )
}