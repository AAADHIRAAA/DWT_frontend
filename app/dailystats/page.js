"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSortBy, useTable,useGlobalFilter } from "react-table";
import { useUser } from "@clerk/nextjs";

import Header from "../components/Header";
import Image from "next/image";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";
import { BiChevronUp } from "react-icons/bi";
import { Globalfilter } from "../components/Globalfilter";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PieChart from "../components/dailystatsGraph";


import moment from "moment";

const SpreadsheetMonth = () => {
  const scrollRef = useRef(null);
  const [rowData, setRowData] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useUser();
 
  const [fullData, setFullData] = useState([]); // Store all the data
  const [visibleData, setVisibleData] = useState([]); // Data currently visible in the table

  const [hasMore, setHasMore] = useState(true); // Whether more data is available
  const PAGE_SIZE = 150;
  const currentDate = new Date();
  const firstDayOfMonth = moment().startOf('month').toDate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [chartData, setChartData] = useState([]);

  // function formatDate(date) {
  //   const day = String(date.getDate()).padStart(2, "0");
  //   const month = String(date.getMonth() + 1).padStart(2, "0");
  //   const year = date.getFullYear();
  //   return `${month}/${day}/${year}`;
  // }

 
 

  useEffect(() => {
    if (user) {
      const userRole = user.publicMetadata.userRole;
      setIsAdmin(userRole === "admin");
    }
  }, [user]);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 60 * 10 * 1000);
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
  const filterByDates = (rows, columnIds, filterValue) => {
    return rows.filter((row) => {
      return columnIds.some((columnId) => {
        const rowValue = row.values[columnId];
        if (rowValue) {
          const formattedDate = new Date(rowValue).toLocaleDateString("en-US");
          return formattedDate.includes(filterValue);
        }
        return false;
      });
    });
  };
  useEffect(() => {
    const filteredData = rowData.filter((entry) => {
      const date = moment(selectedDate);
      const matchdate = moment(entry.date, "M/D/YYYY");
      return matchdate.isSame(date, "day"); // Filter by date
    });
    const pagesScannedByPerson = {};
    filteredData.forEach((entry) => {
      const { username, pagesScanned } = entry;
      if (!pagesScannedByPerson[username]) {
        pagesScannedByPerson[username] = 0;
      }
      pagesScannedByPerson[username] = pagesScanned;
    });

    const pieChartData = Object.keys(pagesScannedByPerson).map((username) => {
      return {
        name: username,
        pagesScanned: pagesScannedByPerson[username],
      };
    });
    setChartData(pieChartData);
  }, [selectedDate, rowData]);

  const fetchData = async () => {
    try {
    

      const response = await fetch(
        "https://trackserv.techfiz.com/api/v1/admin/viewdailystats"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // const data = await response.json();
      // setRowData(data);
      const fetchedData = await response.json();
      const filteredData = fetchedData.filter(entry => entry.pagesScanned > 0 && entry.booksScanned > 0);
      setRowData(filteredData);

      
      const sortedData = filteredData.sort((a, b) => {
        if (a.date !== b.date) {
          return new Date(b.date) - new Date(a.date);
        } else {
          return a.username.localeCompare(b.username);
        }
      });

      setFullData(sortedData);
      setVisibleData(sortedData.slice(0, PAGE_SIZE));
     
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };
  const fetchMoreData = () => {
    console.log("Fetching");
    const currentLength = visibleData.length;
    const nextData = fullData.slice(currentLength, currentLength + PAGE_SIZE);
    setVisibleData([...visibleData, ...nextData]);
    setHasMore(currentLength + PAGE_SIZE < fullData.length);
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow ,state: { globalFilter },
  setGlobalFilter} =
    useTable({ columns, data: visibleData ,filterTypes: {
      datetime: filterByDates,
    }},
     useGlobalFilter,
      useSortBy
      );


  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };
  const scrollToUp = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
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

            {/* <div className="flex flex-row items-center justify-center">
              <div className="mb-4 h-full">
               
                <PieChart data={chartData} />
              </div>
              <div className="flex justify-center">
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  minDate={firstDayOfMonth}
                  maxDate={currentDate}
                />
                
              </div>
            </div> */}
            <div className="flex justify-end mb-4 text-sky-800 mr-8">
            <Globalfilter
              filter={globalFilter}
              setFilter={setGlobalFilter}
              className="mr-8"
            />
          </div>
            <div className=" h-[500px]">
              <table
                {...getTableProps()}
                className=" divide-y divide-gray-200"
                style={{ maxWidth: "80%" }}
                ref={scrollRef}
              >
                <thead className={"sticky top-0"}>
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
              <button
                onClick={scrollToBottom}
                className="bg-sky-800 hover:bg-sky-600 text-white py-1 px-1 rounded fixed bottom-10 right-2"
              >
                <Image
                  src="/scroll-down.png"
                  alt="Scrolldown"
                  width={20}
                  height={20}
                />
              </button>
              <button
                onClick={scrollToUp}
                className="bg-sky-800 hover:bg-sky-600 text-white py-1 px-1 rounded fixed bottom-20 right-2"
              >
                <BiChevronUp className={"h-5 w-5"} />
              </button>

              {/*<ScrollBar className={" right-0"}/>*/}
            </div>
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
