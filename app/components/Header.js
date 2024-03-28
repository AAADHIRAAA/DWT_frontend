"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  RedirectToSignIn,
  SignInButton,
  UserProfile,
  UserButton,
  useClerk,
  useUser,
} from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";
import DialogBox from "./holidaymonthstats";

const Header = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const [selectedScribe, setSelectedScribe] = useState(null);
  const { user } = useUser();
  const [loginTime, setLoginTime] = useState(null);
  const [logoutTime, setLogoutTime] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [issues, setIssues] = useState("");
  const [userId, setUserId] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isAccountsOpen, setIsAccountsOpen] = useState(false);

  
  const { signOut } = useClerk();


  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
    setIsStatsOpen(false); 
    setIsAccountsOpen(false); 
  };


  const handleStatsMouseEnter = () => {
    setIsStatsOpen(true);
    setIsAccountsOpen(false); 
  };


  const handleAccountsMouseEnter = () => {
    setIsAccountsOpen(true);
    setIsStatsOpen(false);
  };

 
  

  useEffect(() => {
    if (user) {
      setUserId(user.id);
      console.log("User ID:", user.id);
    }
  }, [user, userId]);

  const handleLogout = async () => {
    const confirmation = window.confirm(
      "Are you sure to end the day?  This will end the day"
    );
    const getTimeString = (date) => {
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const seconds = date.getSeconds().toString().padStart(2, "0");
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
    if (issues.trim() === "") {
      alert("Please enter your issues before submitting.");
    } else {
      try {
        const response = await fetch(
          "https://digitized-work-tracker-backend.vercel.app/api/v1/users/issue",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, logoutTime, issues }),
          }
        );

        if (response.ok) {
          await signOut();

          router.push("/");
        } else {
          console.error("Failed to store issues and logout time");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const getScribeNumber = () => {
    const storedScribe = localStorage.getItem("selectedScribe");
    if (!storedScribe) {
      router.push("/");
    } else {
      setSelectedScribe(storedScribe);
    }
  };

  const storeFirstLoginTime = async () => {
    try {
      await axios.post("https://digitized-work-tracker-backend.vercel.app/api/v1/users/login", {
        userId: user.id,
        userName: user.fullName,
        scannerNumber: selectedScribe,
      });
    } catch (error) {
      console.error("Error storing first login time:", error);
    }
  };

  useEffect(() => {
    getScribeNumber();
    if (user) {
      const userRole = user.publicMetadata.userRole;
      setIsAdmin(userRole === "admin");
    }
    if (selectedScribe) {
      storeFirstLoginTime();
    }
  }, [user, selectedScribe]);

  return (
    <header className="bg-gray-100 py-1 px-2 flex flex-col sm:flex-row justify-between items-center">
      <div className="flex justify-start items-center align-left mr-auto">
      {user && (
        <>
    
      <button
          onClick={() => setShowMenu(!showMenu)}
          className="block sm:hidden focus:outline-none"
        >
          <svg
            className="h-6 w-6 text-gray-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {showMenu ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>
      
          <div className="text-center sm:text-center align-center">
            <Link href="/dashboard">
              <h2 className=" mb-3 ml-4 text-sky-800 text-lg sm:text-xl md:text-xl font-semibold xl:text-xl ">
                #ServantsOfKnowledge
              </h2>
            </Link>

            {loginTime && (
              <h2 className=" mb-3 text-sky-800 text-lg sm:text-xl md:text-xl  xl:text-xl">
                LoginTime: {loginTime}
              </h2>
            )}
          </div>
        </>
      )}
      {!user && (
        <>
        <div className="mr-auto">
        <button
        onClick={() => setShowMenu(!showMenu)}
        className="block sm:hidden focus:outline-none"
      >
        <svg
          className="h-6 w-6 text-gray-800"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {showMenu ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          )}
        </svg>
      </button>
        </div>
        
        <nav className="flex justify-between">
        
          <h2 className="mb-3 ml-4 text-sky-800 text-lg sm:text-xl md:text-xl  xl:text-xl">
            #ServantsOfKnowledge
          </h2>
          
        </nav>
        </>
      )}


      </div>
      
      
      <nav className="hidden sm:flex items-center justify-between sm:justify-start w-full sm:w-auto">
        <>
          {!user && (
            <>
              <button className={"bg-sky-800 text-white p-3 rounded-2xl"}>
                <SignInButton />
              </button>
              <div className="mr-2">
                <UserButton afterSignOutUrl="/" />
              
              </div>
            </>
          )}

          {user && (
            <>
              
              {isAdmin && (
               <div className="relative inline-block" style={{ zIndex: 9999}}>
                  <h2 className="mb-3 text-sky-800 text-lg sm:text-xl md:text-xl xl:text-xl cursor-pointer mr-4"
                      onMouseEnter={handleMouseEnter}
                      >
                    Admin

                  </h2>
                  {isOpen && (
                    <div className="absolute left-0  shadow-md py-2 rounded-md text-black"
                    onMouseLeave={handleMouseLeave}>
                       <div className="relative">
            <h3
              className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
              onMouseEnter={handleStatsMouseEnter}
            >
              Stats
            </h3>
            {isStatsOpen && (
              <div
                className="absolute top-0 left-full bg-white shadow-md py-2 rounded-md text-black"
                onMouseLeave={() => setIsStatsOpen(false)}
              >
                <Link href="/dailystats" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Daily
                </Link>
                <Link href="/monthstats" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Monthly
                </Link>
                <Link href="/digitizedstats" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Yearly
                </Link>
                
              </div>
            )}
          </div>
          <div className="relative">
            <h3
              className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
              onMouseEnter={handleAccountsMouseEnter}
            >
              Accounts
            </h3>
            {isAccountsOpen && (
              <div
                className="absolute top-0 left-full justify-center shadow-md py-2 rounded-md text-black"
                onMouseLeave={() => setIsAccountsOpen(false)}
              >
                <Link href="/scanAgent"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Scan Agent
                </Link>
                <Link href="/paymentStats"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Payment
                </Link>
                {/* <Link href="/holidays"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200" >Holidays
                </Link> */}
                <div className="block px-4 py-2 text-gray-800 hover:bg-gray-200" ><DialogBox/></div>
              </div>
            )}
          </div>
                   
                    </div>
            )}
                </div>
              )}
              <div className="mr-4">
                {selectedScribe && (
                  <h2 className="mb-3 text-sky-800 text-lg sm:text-xl md:text-xl  xl:text-xl">
                    {selectedScribe}
                  </h2>
                )}
              </div>

              <Link href="/workreport" className="mr-4 ml-1">
                <h2 className="mb-3 text-sky-800 text-lg sm:text-xl md:text-xl  xl:text-xl">
                  Dashboard
                </h2>
              </Link>

              <div className="mr-4">
             
                <UserButton userProfileMode="navigation"  userProfileUrl="/profile" afterSignOutUrl="/" />

              </div>
              <div>
                <button
                  onClick={handleLogout}
                  className="ml-4 bg-red-500 hover:bg-red-700 text-white  py-2 px-2 rounded"
                >
                  End the day
                </button>
                <div className="ml-4 text-sky-800">
                  {logoutTime && <p>Logout Time: {logoutTime}</p>}
                </div>
                {showModal && (
                  <div>
                    <div className="mr-4 ml-8">
                      <h1 className="text-sky-800 mt-4">Enter any issues:</h1>
                      <textarea
                        value={issues}
                        className="border border-gray-300 p-2 rounded-md  h-24 mt-2 focus:outline-none focus:border-sky-500 text-sky-800"
                        placeholder="Enter your issues here..."
                        onChange={(e) => setIssues(e.target.value)}
                      />
                      <button
                        onClick={handleIssuesSubmit}
                        className="border border-gray-300 p-2 rounded-md  h-15 ml-2 bg-sky-800 text-white"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      </nav>
      
        
        <nav className={showMenu ? "flex sm:hidden" : "hidden"}>
        
      
        <div className="flex flex-row  items-center gap-3 sm:justify-start w-full sm:w-auto">
       
          {!user && (
            <>
              <button className="bg-sky-800 text-white p-2 rounded-xl">
                <SignInButton />
              </button>
              <div className="mt-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            </>
          )}
          {user && (
            <>
              <div className="mr-3">
                {selectedScribe && (
                  <h2 className="mb-3 text-sky-800 text-lg sm:text-xl md:text-xl  xl:text-xl">
                    {selectedScribe}
                  </h2>
                )}
              </div>

              {isAdmin && (
                // <Link href=" /admin" className="mr-3">
                //   <h2 className="mb-3 text-sky-800 text-lg sm:text-xl md:text-xl  xl:text-xl">
                //     Admin
                //   </h2>
                // </Link>
                <div className="relative inline-block " style={{ zIndex: 9999}}>
                  <h2 className="mb-3 text-sky-800 text-lg sm:text-xl md:text-xl xl:text-xl cursor-pointer mr-4 "
                      onMouseEnter={handleMouseEnter}
                      >
                    Admin

                  </h2>
                  {isOpen && (
                    <div className="absolute left-0  shadow-md py-2 rounded-md text-black font-bold bg-sky-200"
                    onMouseLeave={handleMouseLeave}>
                       <div className="relative">
            <h3
              className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
              onMouseEnter={handleStatsMouseEnter}
            >
              Stats
            </h3>
            {isStatsOpen && (
              <div
                className="absolute top-0 left-full bg-white shadow-md py-2 rounded-md text-black font-bold bg-sky-200"
                onMouseLeave={() => setIsStatsOpen(false)}
              >
                <Link href="/dailystats" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Daily
                </Link>
                <Link href="/monthstats" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Monthly
                </Link>
                <Link href="/digitizedstats" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Yearly
                </Link>
                
              </div>
            )}
          </div>
          <div className="relative">
            <h3
              className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer font-bold bg-sky-200"
              onMouseEnter={handleAccountsMouseEnter}
            >
              Accounts
            </h3>
            {isAccountsOpen && (
              <div
                className="absolute top-0 left-full justify-center shadow-md py-2 rounded-md text-black font-bold bg-sky-200"
                onMouseLeave={() => setIsAccountsOpen(false)}
              >
                <Link href="/scanAgent"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Scan Agent
                </Link>
                <Link href="/paymentStats"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Payment
                </Link>
                {/* <Link href="/holidays"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200" >Holidays
                </Link> */}
                <div className="block px-4 py-2 text-gray-800 hover:bg-gray-200" ><DialogBox/></div>
              </div>
            )}
          </div>         
        </div>
            )}
                </div>
              )}
               

              <Link href="/workreport" className="mr-3 ">
                <h2 className="mb-3 text-sky-800 text-lg sm:text-xl md:text-xl  xl:text-xl">
                  Dashboard
                </h2>
              </Link>
              <div className="my-2 mr-3">
                <UserButton userProfileMode="navigation"  userProfileUrl="/profile"  afterSignOutUrl="/" />
              </div>
              <div>
                <button
                  onClick={handleLogout}
                  className="  bg-red-500 hover:bg-red-700 text-white  py-1 px-1 rounded"
                >
                  End day
                </button>
                <div className="ml-4 text-sky-800">
                  {logoutTime && <p>Logout Time: {logoutTime}</p>}
                </div>
                {showModal && (
                  <div>
                    <div className="mr-4 ml-8">
                      <h1 className="text-sky-800 mt-4">Enter any issues:</h1>
                      <textarea
                        value={issues}
                        className="border border-gray-300 p-2 rounded-md  h-24 mt-2 focus:outline-none focus:border-sky-500 text-sky-800"
                        placeholder="Enter your issues here..."
                        onChange={(e) => setIssues(e.target.value)}
                      />
                      <button
                        onClick={handleIssuesSubmit}
                        className="border border-gray-300 p-2 rounded-md  h-15 ml-2 bg-sky-800 text-white"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </nav>
      
    </header>
  );
};

export default Header;
