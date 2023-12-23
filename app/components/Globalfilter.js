 import React from 'react'
 export const Globalfilter = ({filter, setFilter})=>{
    return(
        <span>
            <div className='ml-8 text-sky-800'>
            Search:{' '}
            <input value={filter || ''} onChange={(e)=> setFilter(e.target.value)} className=' bg-blue-200 pl-2 p-1 rounded-2xl'/>
            </div>
        </span>
    )
 }