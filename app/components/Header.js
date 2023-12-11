"use client"
import React,{useEffect, useState} from "react";
import Link from "next/link";
import {RedirectToSignIn, SignInButton, UserButton, useClerk,useUser} from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const Header = () => {

  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const [selectedScribe, setSelectedScribe] = useState(null);
  const { user } = useUser();
  const [loginTime, setLoginTime] = useState(null);
  const [logoutTime, setLogoutTime] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [issues, setIssues] = useState('');
  const [userId, setUserId] = useState(null);
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

  const getScribeNumber = () => {
    const storedScribe = localStorage.getItem('selectedScribe');
    if (!storedScribe) {
      router.push('/');
    } else {
      setSelectedScribe(storedScribe);
   
    }
 };

 const getTimeString = (date) => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};
 const storeFirstLoginTime = async () => {
  try {

    const storedFirstLoginTimes = JSON.parse(localStorage.getItem('firstLoginTimes')) || {};
    const currentDate = new Date().toLocaleDateString('en-US');
    const currentTime = new Date();
    await axios.post('https://digitized-work-tracker-backend.vercel.app/api/v1/users/login', {
      userId: user.id,
      userName: user.fullName,
      scannerNumber: selectedScribe,
      firstLoginTime: storedFirstLoginTimes[user.id].time,
      date: currentDate
    });
    if (!storedFirstLoginTimes[user.id] || storedFirstLoginTimes[user.id].date !== currentDate) {
      const timeString = getTimeString(currentTime);
      storedFirstLoginTimes[user.id] = {date: currentDate, time: timeString};
      localStorage.setItem('firstLoginTimes', JSON.stringify(storedFirstLoginTimes));
      console.log("login1");
      // Make a POST request to the backend API to store first login time

      if (!loginTime) {
        setLoginTime(getTimeString(new Date()));
        console.log("loggedin");
      }
    
    }
    if (!loginTime) {
      setLoginTime(storedFirstLoginTimes[user.id].time);
      console.log("loggedin");
    }
  } catch (error) {
    console.error('Error storing first login time:', error);

  }
};

useEffect(() => {
  getScribeNumber();
  if (user) { 
    const userRole = user.publicMetadata.userRole;
    setIsAdmin(userRole === 'admin');
   
  }
  if(selectedScribe){
    storeFirstLoginTime();
  }
}, [user,selectedScribe]);


  return (
    <header className="bg-gray-100 py-1 px-2 flex flex-col sm:flex-row justify-between items-center">
         {user &&(
          <>
         
            <div className="text-center sm:text-left">
            <Link href="/dashboard" >
             <h2 className=" mb-3 mr-3 text-sky-800 text-lg sm:text-xl md:text-xl font-semibold xl:text-xl">#ServantsOfKnowledge</h2>
            </Link>
          
            
             {loginTime && 
             <h2 className=" mb-3 text-sky-800 text-lg sm:text-xl md:text-xl  xl:text-xl">LoginTime: {loginTime}</h2>}
             </div>
         
                 
            </>
         )}
         {!user &&(
          <nav className="flex items-center justify-between ">
           
            <h2 className="mb-3 mr-4 text-sky-800 text-lg sm:text-xl md:text-xl  xl:text-xl">#ServantsOfKnowledge</h2>
         
          </nav>
           
         )}
        
          
          
        <nav className="flex items-center justify-between sm:justify-start w-full sm:w-auto">
          <>
          {!user && (
            <>
              {/*<Link href="/machine" className="mr-4">*/}
              {/*  <h2 className="mb-3 text-sky-800 text-lg">*/}
              {/*   Login*/}
              {/*  </h2>*/}
              {/*</Link>*/}
                <button className={"bg-sky-800 text-white p-3 rounded-2xl"}>
                <SignInButton />
                </button>
              <div className="mr-2">
                <UserButton afterSignOutUrl="/"/>
              </div>
            </>
          )}
         
       
            {user && (
              <>
               {isAdmin && (
                <Link href=" /admin" className="mr-4">
                  <h2 className="mb-3 text-sky-800 text-lg sm:text-xl md:text-xl  xl:text-xl">Admin Page</h2></Link>
                )}
              <div  className="mr-4">
            {selectedScribe && (
              <h2 className="mb-3 text-sky-800 text-lg sm:text-xl md:text-xl  xl:text-xl">
                {selectedScribe}
              </h2>
                )}
              </div>
         
                <Link href="/workreport" className="mr-4 ml-1">
                  <h2 className="mb-3 text-sky-800 text-lg sm:text-xl md:text-xl  xl:text-xl">Dashboard</h2>
                </Link>
              
                <div className="mr-4">
                  <UserButton afterSignOutUrl="/"/>
                </div>
                <div>
                <button onClick={handleLogout} className="ml-4 bg-red-500 hover:bg-red-700 text-white  py-2 px-2 rounded">End the day</button>
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
              </div>      
              </>
            )}
            
          </>
        </nav>
       
    </header>
  );
};

export default Header;
