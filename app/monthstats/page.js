"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { useUser } from "@clerk/nextjs";
import Header from "../components/Header";
import Link from "next/link";
import Image from "next/image";
import MonthSelection from "../components/monthdropdown";
import DialogBox from "../components/holidaymonthstats";
import {ScrollArea} from "@/app/components/ui/scroll-area";
import {clearInterval} from "timers";

const LeaderBoardMonth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() +1) ;
  const { user } = useUser();

  const [editableCell, setEditableCell] = useState(null);

  const handleCellEdit = (rowIndex, columnId) => {
    setEditableCell({ rowIndex, columnId });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedRowData = [...rowData];
    updatedRowData[editableCell.rowIndex][editableCell.columnId] = value;
    localStorage.setItem("rowData", JSON.stringify(updatedRowData));
    setRowData(updatedRowData);
    console.log(updatedRowData);
  };



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
      },
      {
        Header: "Total Books#",
        accessor: "totalBooks",
      },
      {
        Header: "Total Pages#",
        accessor: "totalPages",
      },
      {
        Header: "Total Wdays",
        accessor: "totalWorkingDays",
      },
      // {
      //   Header: "Total Whrs",
      //   accessor: "workinghrs",
      // },

      {
        Header: "Total days",
        accessor: "totalDays",
      },
      {
        Header: "Leaves taken",
        accessor: "leaves",
      },

      {
        Header: "Payment",
        accessor: "payment",
      },
    ],
    []
  );

  const fetchData = async () => {
    try {
      setIsLoadingStats(true);
      console.log(selectedMonth);
      const response = await fetch(
        `https://digitized-work-tracker-backend.vercel.app/api/v1/admin/leaderboard-month/${selectedMonth}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      
      const fetchedData = await response.json();

      // Sort the fetched data by the "userName" column in ascending order
      const sortedData = fetchedData.sort((a, b) =>
        a.username.localeCompare(b.username)
      );
      setRowData(sortedData);

      // Merge the existing rowData with the newData fetched from the API
      // const updatedRowData = [...rowData, ...newData];
      // setRowData(updatedRowData);

      setIsLoadingStats(false);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
    useTable({ columns, data: rowData }, useSortBy);


  useEffect( () => {
     fetchData().then();

  }, [selectedMonth])

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
              <h1 className="text-3xl font-bold text-sky-800 ">Month Stats</h1>
              <MonthSelection selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth}/>
              <DialogBox selectedMonth={selectedMonth}/>
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

export default LeaderBoardMonth;
