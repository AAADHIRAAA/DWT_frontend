import React, { useState, useEffect, useMemo } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { useUser } from "@clerk/nextjs";

const Spreadsheet = () => {
  const [rowData, setRowData] = useState([]);
  const { user } = useUser();
  const [userId, setUserId] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    if (user) {
      setUserId(user.id);
      console.log("User ID:", user.id);
      fetchData();
      const intervalId = setInterval(fetchData, 20 * 60 * 1000);
      // Clean up the interval when the component unmounts
      return () => clearInterval(intervalId);
    }
  }, [user, userId]);

 const columns = useMemo(
  () => [
    {
      Header: 'S.No',
      accessor: (row, index) => index + 1, // Automatically generate serial number
    },
     {
       Header: 'Book Name',
       accessor: 'title',
     },
     {
       Header: 'Total Pages Scanned',
       accessor: 'pages_scanned',
     },
     {
      Header: 'Archieve Identifier',
      accessor: 'ID_url',
      Cell: ({ row }) => (
        <a href={row.original.ID_url} target="_blank" rel="noopener noreferrer" >
          {row.original.ID_url.split('details/')[1]}
        </a>
      ),
    },
    {
      Header: 'Author Name',
      accessor: 'author_name',
    },
    {
      Header: 'Publisher Name',
      accessor: 'publisher_name',
    },
    {
      Header: 'Published Year',
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
      if (userId) {
        const response = await fetch(
          `https://digitized-work-tracker-backend.vercel.app/api/v1/users/view-books/${userId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setRowData(data);

        setIsLoadingStats(false);
      } else {
        <div>Loading...</div>;
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
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
    state: { pageIndex },
    pageCount,
    gotoPage,
  } = useTable({ columns, data: rowData }, useSortBy, usePagination);

  console.log(rowData);

  return (
    <>
      <div style={{ marginTop: "50px" }}>
        <h1 className="custom-heading">Digitization Stats</h1>

        <div className=" overflow-x-auto">
          <table {...getTableProps()} className="divide-y divide-gray-200">
            <thead>
              {headerGroups.map((headerGroup, index) => (
                <tr key={index} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column, index) => (
                    <th
                      key={index}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
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
              {page.map((row, index) => {
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

        <div className="btn-container">
          <button disabled={pageIndex === 0} onClick={() => gotoPage(0)}>
            First
          </button>

          <button disabled={!canPreviousPage} onClick={previousPage}>
            Prev
          </button>

          <span>
            {pageIndex + 1}_of_{pageCount}
          </span>

          <button disabled={!canNextPage} onClick={nextPage}>
            Next
          </button>

          <button
            disabled={pageIndex >= pageCount - 1}
            onClick={() => gotoPage(pageCount - 1)}
          >
            Last
          </button>
        </div>
      </div>
    </>
  );
};

export default Spreadsheet;
