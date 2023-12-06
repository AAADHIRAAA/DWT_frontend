"use client"
import React, { useState, useEffect,useMemo } from 'react';
import { useTable,useSortBy, usePagination} from 'react-table';
import { useUser} from '@clerk/nextjs';
import Header from "../components/Header";
import Link from 'next/link';
import Image from 'next/image';

const SpreadsheetMonth = () => {
 const [rowData, setRowData] = useState([]);
 const [isAdmin, setIsAdmin] = useState(false);
 const { user } = useUser();
 const [isLoadingStats, setIsLoadingStats] = useState(true);

 useEffect(()=>{
    if(user){
      const userRole = user.publicMetadata.userRole;
      setIsAdmin(userRole === 'admin');
    }
   },[user]);

 useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 15 * 60 * 1000);
    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  
}, []);

 const columns = useMemo(
  () => [
    {
      Header: 'S.No',
      accessor: (row, index) => index + 1, // Automatically generate serial number
    },
    {
        Header: 'Scan Agent',
        accessor: 'userName',
      },
      {
        Header: 'Scanner#',
        accessor: 'scribe_number',
      },
     {
       Header: 'Title',
       accessor: 'title',
     },
     {
        Header: 'Scan Date',
        accessor: 'scanned_at',
      },
     {
       Header: '#Pages',
       accessor: 'pages_scanned',
     },
     {
      Header: 'Identifier',
      accessor: 'ID_url',
    },
    {
      Header: 'Author',
      accessor: 'author_name',
    },
    {
      Header: 'Publisher',
      accessor: 'publisher_name',
    },
    {
      Header: 'Year',
      accessor: 'year',
    },
    {
      Header: 'ISBN',
      accessor: 'isbn',
    },
    {
      Header:'Language',
      accessor:'language',
    }
     
  ],
  []
 );

 const fetchData = async () => {
  
    try {
      setIsLoadingStats(true);
      
      const response = await fetch('https://digitized-work-tracker-backend.vercel.app/api/v1/admin/viewbooks-month');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      setRowData(data);
      
      setIsLoadingStats(false);
      
     
      
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }

 };


 const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    state:{pageIndex},
    pageCount,
    gotoPage,
   
 } = useTable(
  { columns, 
    data: rowData ,
    initialState: { pageSize: 5 },
  },
  useSortBy,
  usePagination
  );

 console.log(rowData);

 
  

 return (
    <>
     {!isAdmin &&(
        <>
        <div style={{ textAlign: 'center', marginTop: '60px' }}><h1 style={{fontSize:'30px', color:'black'}}>This Page is restricted</h1></div>
        <div  style={{ textAlign: 'center', marginTop: '60px' }}>
        <Link href="/workreport">Return to Homepage</Link></div>
        </>
    )}
    {isAdmin &&(
      <>
    <Header/>
    <div style={{marginTop:'50px'}}>
    
        <h1  className='custom-heading' >Digitized Books Stats</h1>
      <div className="m-4 p-4 overflow-x-scroll  flex justify-center justify-items-center">
      <table {...getTableProps()} className="ml-8 divide-y divide-gray-200 max-w-[100%]" >
        <thead>
          {headerGroups.map((headerGroup,index) => (
            <tr key={index} {...headerGroup.getHeaderGroupProps()}  >
              {headerGroup.headers.map((column,index) => (
                <th key={index} {...column.getHeaderProps(column.getSortByToggleProps())} className="px-4 py-2 text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl" >
                  {column.render('Header')}
                  {
                    column.isSorted && <span>{column.isSortedDesc?" ⬇️ ":" ⬆️ "}</span>
                  }
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} >
          {page.map((row,pageIndex) => {
            prepareRow(row);
            return (
              <tr key={pageIndex} {...row.getRowProps()} >
                {row.cells.map((cell,index) => {
                 return <td key={index} {...cell.getCellProps()} className="px-4 py-2 text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl">{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
      <div className='btn-container' >
     
          <button disabled={pageIndex===0} onClick={()=>gotoPage(0)}>First</button>

        <button disabled={!canPreviousPage} onClick={previousPage}>Prev</button>
     
          <span>
              {pageIndex+1 }_of_{pageCount}
          </span>
         
        <button disabled={!canNextPage} onClick={nextPage}>Next</button>

        <button disabled={pageIndex >= pageCount - 1} onClick={()=>gotoPage(pageCount -1)}>Last</button>
        </div>
    </div>
 
    </>
    )}
    </>
 );
};

export default SpreadsheetMonth;
