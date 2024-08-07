import React, { useState, useEffect, useMemo } from "react";
import { useTable, useSortBy } from "react-table";

const MonthLeaderBoard = ({location}) => {
  const [rowData, setRowData] = useState([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 60 * 10 * 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [location]);

  const columns = useMemo(
    () => [
      {
        Header: "S.No",
        accessor: (row, index) => index + 1, // Automatically generate serial number
      },
      {
        Header: "User Name",
        accessor: "username",
      },
    
      {
        Header: "#Books",
        accessor: "totalBooks",
      },
     
      {
        Header: "#Pages",
        accessor: "totalPages",
      },
    ],
    []
  );

  const fetchData = async () => {
    try {
      setIsLoadingStats(true);
      // console.log("Location:", location);
      const response = await fetch(
        `https://trackserv.techfiz.com/api/v1/admin/leaderboard-month/${currentMonth}/${currentYear}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // const data = await response.json();
      // setRowData(data);
      const fetchedData = await response.json();

      // Sort the fetched data by the "scanned_at" date in descending order
      const sortedData = fetchedData.sort((a, b) => {
        if (a.totalPages !== b.totalPages) {
          return b.totalPages - a.totalPages;
        } else {
          return b.username - a.username;
        }
      });

      setRowData(sortedData);

      setIsLoadingStats(false);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: rowData }, useSortBy);

  return (
    <div className="overflow-x-auto">
      <table
        {...getTableProps()}
        className="min-w-full divide-y divide-gray-200"
        style={{ minWidth: "60%" }}
      >
        <thead>
          {headerGroups.map((headerGroup, index) => (
            <tr key={index} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, index) => (
                <th
                  key={index}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
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
    </div>
  );
};

export default MonthLeaderBoard;
