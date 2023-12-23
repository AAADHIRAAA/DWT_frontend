"use client";
import React, { useEffect, useMemo, useState } from "react";
import { usePagination, useSortBy, useTable } from "react-table";
import { useUser } from "@clerk/nextjs";
import Header from "../components/Header";
import Image from "next/image";
import Link from "next/link";
import InfiniteScroll from 'react-infinite-scroll-component';

const SpreadsheetMonth = () => {
  const [rowData, setRowData] = useState([]);
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
    const intervalId = setInterval(fetchData,  60 * 1000);
    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "S.No",
        accessor: (row, index) => index + 1, // Automatically generate serial number
      },
      {
        Header: "Date",
        accessor: "date",
      },
      {
        Header: "Scan Agent",
        accessor: "username",
      },
      {
        Header: "Scribe#",
        accessor: "scribeNumber",
      },
      {
        Header: "Books#",
        accessor: "booksScanned",
      },

      {
        Header: "Pages#",
        accessor: "pagesScanned",
      },
      {
        Header: "LoginTime",
        accessor: "loginTime",
      },
      {
        Header: "LogoutTime",
        accessor: "logoutTime",
      },
      {
        Header: "Target ",
        accessor: "targetAchieved",
      },
      {
        Header: "Issues",
        accessor: "issue",
      },
      {
        Header: "Working Hrs",
        accessor: "workingHours",
      },
    ],
    []
  );

  const fetchData = async () => {
    try {
      setIsLoadingStats(true);

      const response = await fetch(
        "https://digitized-work-tracker-backend.vercel.app/api/v1/admin/viewdailystats"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // const data = await response.json();
      // setRowData(data);
      const fetchedData = await response.json();

    // Sort the fetched data by the "scanned_at" date in descending order
    const sortedData = fetchedData.sort((a, b) =>{
        if (a.date!==b.date){
          return   new Date(b.date) - new Date(a.date);
        }else{
          return a.username.localeCompare(b.username);
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

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
 
    rows,
    prepareRow,
   
  } = useTable(
    { columns, data: visibleData },
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
            <h1 className="custom-heading">Daily Stats</h1>
            <div className=" overflow-x-auto">
              <table
                {...getTableProps()}
                className=" divide-y divide-gray-200"
                style={{ maxWidth: "80%" }}
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
                              className="px-4 py-2 text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl"
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
         
          </div>
        </>
      )}
    </>
  );
};

export default SpreadsheetMonth;
