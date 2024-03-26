"use client"

import React from 'react';
import GoogleSheetComponent from "../components/googleSheet";
import Header from "../components/Header";
export default function prefixSheet(){
    return(
        <>
        <Header/>
        <div className='justify-center items-center mx-auto align-center mt-4 ml-2 flex flex-col gap-4'>
            <h2>Prefix List</h2>
        <GoogleSheetComponent/>
        </div>
        
        </>
    )
}