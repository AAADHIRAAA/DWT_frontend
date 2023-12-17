import React, { useState, useEffect, useMemo } from "react";
import { useTable, useSortBy } from "react-table";

const LeaderBoard = () => {
  const [rowData, setRowData] = useState([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 60 * 1000);

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
        Header: "User Name",
        accessor: "username",
      },
      {
        Header: "Scribe Number",
        accessor: "scribeNumber",
      },
      {
        Header: "Total Books Scanned",
        accessor: "totalBooks",
      },
      {
        Header: "Total Pages Scanned",
        accessor: "totalPages",
      },
    ],
    []
  );

  const fetchData = async () => {
    try {
      setIsLoadingStats(true);

      const response = await fetch(
        "https://digitized-work-tracker-backend.vercel.app/api/v1/books/leaderboard"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setRowData(data);
    
     
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

export default LeaderBoard;
