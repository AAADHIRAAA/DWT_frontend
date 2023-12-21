"use client";
import React, { useState, useEffect, useMemo } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useTable, useSortBy, usePagination, useGlobalFilter } from "react-table";
import { useUser } from "@clerk/nextjs";
import Header from "../components/Header";
import Link from "next/link";
import Image from "next/image";
import { Globalfilter } from "../components/Globalfilter";
import InfiniteScroll from 'react-infinite-scroll-component';

const SpreadsheetMonth = () => {
 
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useUser();
  const [isLoadingStats, setIsLoadingStats] = useState(true);


const [fullData, setFullData] = useState([]); // Store all the data
const [visibleData, setVisibleData] = useState([]); // Data currently visible in the table
const [isLoading, setIsLoading] = useState(false); // Loading indicator
const [hasMore, setHasMore] = useState(true); // Whether more data is available
const PAGE_SIZE = 50;
  
  useEffect(() => {
    if (user) {
      const userRole = user.publicMetadata.userRole;
      setIsAdmin(userRole === "admin");
    }
  }, [user]);

  
  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 10 * 60 * 1000);
 
    return () => clearInterval(intervalId);
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "S.No",
        accessor: (row, index) => index + 1, 
      },
      {
        Header: "Scan Agent",
        accessor: "userName",
      },
      {
        Header: "Scanner#",
        accessor: "scribe_number",
      },
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "Scan Date",
        accessor: "scanned_at",
      },
     {
       Header: '#Pages',
       accessor: 'pages_scanned',
     },
     {
      Header: 'Identifier',
      accessor: 'ID_url',
      Cell: ({ row }) => (
        <a href={row.original.ID_url} target="_blank" rel="noopener noreferrer" >
          {row.original.ID_url.split('details/')[1]}
        </a>
      ),
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

      const response = await fetch(
        "https://digitized-work-tracker-backend.vercel.app/api/v1/admin/viewbooks-month"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const fetchedData = await response.json();

    const sortedData = fetchedData.sort((a, b) =>{
        if(a.scanned_at !==b.scanned_at){
          return new Date(b.scanned_at) - new Date(a.scanned_at);
        }
        else{
            return a.userName.localeCompare(b.userName);
        }
    }
      
    );

   
    setFullData(sortedData);
    setVisibleData(sortedData.slice(0, PAGE_SIZE));
    setIsLoadingStats(false);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const fetchMoreData = () => {
    const currentLength = visibleData.length;
    const nextData = fullData.slice(currentLength, currentLength + PAGE_SIZE);
    setVisibleData([...visibleData, ...nextData]);
    setHasMore(currentLength + PAGE_SIZE < fullData.length);
  };

  const filterByDates = (rows, columnIds, filterValue) => {
    return rows.filter((row) => {
      return columnIds.some((columnId) => {
        const rowValue = row.values[columnId];
        if (rowValue) {
          const formattedDate = new Date(rowValue).toLocaleDateString('en-US');
          return formattedDate.includes(filterValue);
        }
        return false;
      });
    });
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    state: { globalFilter},
    setGlobalFilter,
   
  } = useTable(
    { columns, data: visibleData,
    filterTypes: {
      datetime: filterByDates,
    },},
    useGlobalFilter,
    useSortBy,
  );
  
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth', 
    });
  };

  return (
    <>
      {!isAdmin && (
        <>
          <div style={{ textAlign: "center", marginTop: "60px" }}>
            <h1 style={{ fontSize: "30px", color: "black" }}>
              This Page is restricted
            </h1>
          </div>
          <div style={{ textAlign: "center", marginTop: "60px" }}>
            <Link href="/workreport">Return to Homepage</Link>
          </div>
        </>
      )}
      {isAdmin && (
        <>
          <Header />
          <div style={{ marginTop: "50px" }}>
            
            <h1 className="custom-heading">Digitized Books Stats</h1>
              
            </div>
          
      <div className="flex justify-end mb-4 text-sky-800 mr-8">
      <Globalfilter filter = {globalFilter} setFilter={setGlobalFilter} className="mr-8"/> 
  
      </div>
          <div className="table-container relative">
            <div className="m-6 p-4  overflow-x-auto">
            
              <table
                {...getTableProps()}
                className=" divide-y divide-gray-200 table"
                style={{ Width: "100%", tableLayout: "fixed"  }}
              >
                <thead>
                  {headerGroups.map((headerGroup, index) => (
                    <tr key={index} {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column, index) => (
                        <th
                          key={index}
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          className="px-4 py-2 text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl"
                        >
                          {column.render("Header")}
                          {column.isSorted && (
                            <span>{column.isSortedDesc ? " ⬇️ " : " ⬆️ "}</span>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {rows.map((row, rowIndex) => {
                    prepareRow(row);
                    return (
                      <tr key={rowIndex} {...row.getRowProps()}>
                        {row.cells.map((cell, index) => {
                          return (
                            <td
                              key={index}
                              {...cell.getCellProps()}
                              className="px-4 py-2 text-sm sm:text-base "
                            >
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
             
            </div>
              <button  onClick={scrollToBottom} className="bg-sky-800 hover:bg-sky-600 text-white py-1 px-1 rounded fixed bottom-10 right-2">
              <Image src="/scroll-down.png" alt="Scrolldown" width={20} height={20} />
              </button>
              <InfiniteScroll
              dataLength={visibleData.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={<h4 className="text-sky-800">Loading...</h4>}
              style={{ overflow: "hidden" }} 
            />
            </div>
        </>
      )}
    </>
  );
};

export default SpreadsheetMonth;
