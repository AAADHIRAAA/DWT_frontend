"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { useUser } from "@clerk/nextjs";
import Header from "../components/Header";
import Link from "next/link";
import Image from "next/image";
import MonthSelection from "../components/monthdropdown";
import YearSelection from "../components/yeardropdown";
import DialogBox from "../components/holidaymonthstats";
import {ScrollArea} from "@/app/components/ui/scroll-area";
import {clearInterval} from "timers";

const Holiday = () => {

  const [rowData, setRowData] = useState([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() +1) ;
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { user } = useUser();
  const [message, setMessage]=useState("");

  
  const columns = useMemo(
    () => [
      {
        Header: "S.No",
        accessor: (row, index) => index + 1, // Automatically generate serial number
      },
      {
        Header: "Holiday Date",
        accessor: "holidayDate",
     
      },
      {
        Header: "Holiday Name",
        accessor: "holidayName",
      },
    
    ],
    []
  );

  const fetchData = async () => {
    try {
      setIsLoadingStats(true);
      console.log(selectedMonth);
      const response = await fetch(
        "https://digitized-work-tracker-backend.vercel.app/api/v1/users/view-holidays"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const responseData = await response.json(); // Parse the JSON response
        let holidays = responseData.message;
      
      if(!holidays || holidays.length === 0 || (holidays.length === 1 && holidays[0].length === 0)){
            setMessage("No Holidays registered");
      }
      else{
        holidays = holidays.flat().sort((a, b) => new Date(a.holidayDate) - new Date(b.holidayDate));

      const formattedData = holidays.map(holiday => ({
        holidayDate: formatDate(holiday.holidayDate),
        holidayName: holiday.holidayName
      }));

      setRowData(formattedData);
      }
      

      setIsLoadingStats(false);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
    useTable({ columns, data: rowData }, useSortBy);


  useEffect( () => {
     fetchData().then();

  }, [])

  

  return (
   
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
              <h1 className="text-3xl font-bold text-sky-800 mb-4">Holidays</h1>
              
            
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
                  <div className="mr-auto">
                        <div className=" mt-4 mb-4 ml-4 text-sky-900 items-center font-bold text-lg">{message}</div>
                  </div>
                   
                </tbody>
              </table>
             
            </ScrollArea>
           
          </div>
      
    </>
  );
};

export default Holiday;
