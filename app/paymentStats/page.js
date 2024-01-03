"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { useUser } from "@clerk/nextjs";
import Header from "../components/Header";
import Link from "next/link";
import MonthSelection from "../components/monthdropdown";
import YearSelection from "../components/yeardropdown";
import DialogBox from "../components/Payment";
import {ScrollArea} from "@/app/components/ui/scroll-area";


const PaymentStats = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [Month, setMonth] = useState(new Date().getMonth() +1) ;
  const [Year, setYear] = useState(new Date().getFullYear());
  const { user } = useUser();
  

  useEffect(() => {
    if (user) {
      const userRole = user.publicMetadata.userRole;
      setIsAdmin(userRole === "admin");
    }
  }, [user]);

 
  const columns = useMemo(
    () => [
      {
        Header: "S.No",
        accessor: (row, index) => index + 1, // Automatically generate serial number
      },
      {
        Header: "Scan Agent",
        accessor: "username",
        sortType: "alphanumeric",
        Cell: ({ row }) => {
          const { userId, username } = row.original;
          return (
            <a href={`/dailystats/${userId}/${Month}`} >
              {username}
            </a>
          );
        },
      },
      
      {
        Header: "Payment",
        accessor: "payment",
      },
      {
        Header: "Status",
        accessor: "status",

      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({row}) => {
          const {username, payment, totalWorkingDays, leaves,status,userId,date} = row.original;
          const action = status === "Paid" ? "View" : "Pay";

          const handleButtonClick = () => {
            fetchData();
            if (status === "Not Paid") {
              console.log("Pay Now action triggered");

            } else {
              console.log("View action triggered");

            }
          };

          return (
              <DialogBox
                  action={action}
                  userId={userId}
                  username={username}
                  payment={payment}
                  totalWorkingDays={totalWorkingDays}
                  leaves={leaves}
                  status={status}
                  date={date}
                  handleButtonClick={handleButtonClick}
              />
          );
        },
      },
    ],
    []
  );

  const fetchData = async () => {
    try {
      
      setIsLoadingStats(true);
      
      const response = await fetch(
        `https://digitized-work-tracker-backend.vercel.app/api/v1/admin/leaderboard-month/${Month}/${Year}`
      );


      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      
      const fetchedData = await response.json();


      const sortedData = fetchedData.sort((a, b) =>
          a.username.localeCompare(b.username)
      );
      setRowData(sortedData);

    
      setIsLoadingStats(false);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
    useTable({ columns, data: rowData }, useSortBy);



  useEffect(   () => {

       fetchData();

  }, [Month])

  useEffect(   () => {

    fetchData();

}, [Year])

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
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: "30px",
              }}
            >
              <h1 className="text-3xl font-bold text-sky-800 ">Payment Stats</h1>
              <MonthSelection selectedMonth={Month} setSelectedMonth={setMonth}/>
              <YearSelection selectedYear={Year} setSelectedYear={setYear}/>
            </div>

            <ScrollArea className=" h-[70vh]  ">
              <table
                {...getTableProps()}
                className="min-w-full divide-y divide-gray-200"
                style={{ minWidth: "60%" }}
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
                  {rows.map((row, index) => {
                    prepareRow(row);
                    return (
                      <tr key={index} {...row.getRowProps()}>
                        {row.cells.map((cell, cellIndex) => {
                          return (
                            <td
                              key={cellIndex}
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
            </ScrollArea>
          </div>
        </>
      )}
    </>
  );
};

export default PaymentStats;
