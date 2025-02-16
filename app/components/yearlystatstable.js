"use client";
import React, {useState, useEffect, useMemo, useRef} from "react";
import {
  useTable,
  useSortBy,
} from "react-table";


const YearlyStats = () => {

  const [visibleData, setVisibleData] = useState([]); 
 
  const tableRef = useRef(null);

  const columns = useMemo(
    () => [
      {
        
        Header: "Year",
        accessor:"year",
      },
      {
        Header:" Category",
        accessor:"category",
        Cell:({})=>(
          <div>
            <div>
            BooksCount
            </div>
            <div>
              PagesCount
            </div>
          </div>
        )
      },
      {
        Header: "January",
        accessor: "January",
        Cell: ({ value }) =>
          value ? (
            <div>
              <div>{value.booksCount}</div>
              <div>{value.pagesCount}</div>
            </div>
          ) : (
            " "
          ),
      },
      {
        Header: "Febraury",
        accessor: "February",
        Cell: ({ value }) =>
          value ? (
            <div>
              <div>{value.booksCount}</div>
              <div>{value.pagesCount}</div>
            </div>
          ) : (
            " "
          ),
      },
      {
        Header: "March",
        accessor: "March",
        Cell: ({ value }) =>
          value ? (
            <div>
              <div>{value.booksCount}</div>
              <div>{value.pagesCount}</div>
            </div>
          ) : (
            " "
          ),
      },
      {
        Header: "April",
        accessor: "April",
        Cell: ({ value }) =>
          value ? (
            <div>
              <div>{value.booksCount}</div>
              <div>{value.pagesCount}</div>
            </div>
          ) : (
            " "
          ),
      },
      {
        Header: "May",
        accessor: "May",
        Cell: ({ value }) =>
          value ? (
            <div>
              <div>{value.booksCount}</div>
              <div>{value.pagesCount}</div>
            </div>
          ) : (
            " "
          ),
      },
      
      {
        Header:"June",
        accessor:"June",
        Cell: ({ value }) =>
          value ? (
            <div>
              <div>{value.booksCount}</div>
              <div>{value.pagesCount}</div>
            </div>
          ) : (
            " "
          ),
      },
      {
        Header: "July",
        accessor: "July",
        Cell: ({ value }) =>
          value ? (
            <div>
              <div>{value.booksCount}</div>
              <div>{value.pagesCount}</div>
            </div>
          ) : (
            " "
          ),
      },
      {
        Header: "August",
        accessor: "August",
        Cell: ({ value }) =>
          value ? (
            <div>
              <div>{value.booksCount}</div>
              <div>{value.pagesCount}</div>
            </div>
          ) : (
            " "
          ),
      },
      {
        Header: "September",
        accessor: "September",
        Cell: ({ value }) =>
          value ? (
            <div>
              <div>{value.booksCount}</div>
              <div>{value.pagesCount}</div>
            </div>
          ) : (
            " "
          ),
      },
      {
        Header: "October",
        accessor: "October",
        Cell: ({ value }) =>
          value ? (
            <div>
              <div>{value.booksCount}</div>
              <div>{value.pagesCount}</div>
            </div>
          ) : (
            " "
          ),
      },
      {
        Header: "November",
        accessor: "November",
        Cell: ({ value }) =>
          value ? (
            <div>
              <div>{value.booksCount}</div>
              <div>{value.pagesCount}</div>
            </div>
          ) : (
            " "
          ),
      },
      {
        Header:"December",
        accessor:"December",
        Cell: ({ value }) =>
          value ? (
            <div>
              <div>{value.booksCount}</div>
              <div>{value.pagesCount}</div>
            </div>
          ) : (
            " "
          ),
      }
    ],
    []
  );



  const fetchAllYearStats = async () => {
    try {
      const response = await fetch(
        `https://trackserv.techfiz.com/api/v1/admin/getYearlyStatistics`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const fetchedData = await response.json();
   
      if (
        fetchedData.pagesScannedThisYear &&
        fetchedData.pagesScannedThisYear.length > 0
      ) {
        const formattedData = fetchedData.pagesScannedThisYear.map((item) => {
          const formattedItem = {
            year: item.year,
          };
          item.data.forEach((monthData) => {
            formattedItem[monthData.month] ={
              booksCount: monthData.books || ' ',
             pagesCount: monthData.count  || ' '
            }
          });
          return formattedItem;
        });
        formattedData.sort((a, b) => b.year - a.year);
        
        setVisibleData(formattedData);
      } else {
        setVisibleData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };
  


    useEffect(()=>{
      fetchAllYearStats().then();
   
    },[]);


  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
 
  } = useTable(
    {
      columns,
      data: visibleData,
   
    },

    useSortBy
  );


  return (
    <>
     
          <div className="table-container relative">
            <div ref={tableRef} className=" overflow-x-auto max-h-[65vh]">
              <table
                {...getTableProps()}
                className=" divide-y divide-gray-200 table"
                style={{ maxWidth: "90%"}}
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
                          className="px-4 py-2 text-sm sm:text-base "
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
            </div>

    </>
  );
};

export default YearlyStats;
