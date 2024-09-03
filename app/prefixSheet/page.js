"use client"

import React, {useState, useEffect} from 'react';
import DynamicTable from "../components/prefixSheet";
import PrefixTable from "../components/prefix";
import Header from "../components/Header";
import {useUser} from "@clerk/nextjs";

export default function prefixSheet(){
    const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useUser();
  useEffect(() => {
   
    if (user) {
      const userRole = user.publicMetadata.userRole;
      setIsAdmin(userRole === "admin");
    }
   
  }, [user]);
    return(
        <>
        <Header/>
        <div className='justify-center items-center mx-auto align-center mt-4 ml-2 flex flex-col gap-4'>
            <h2>Prefix List</h2>
            {isAdmin && (
                <DynamicTable/>
            )}
            {!isAdmin && (
                <PrefixTable/>
            )}
        </div>
        
        </>
    )
}