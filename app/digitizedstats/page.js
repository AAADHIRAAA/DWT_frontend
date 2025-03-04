"use client";
import React, {useState, useEffect, useMemo, useRef} from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";
import { useUser } from "@clerk/nextjs";
import Header from "../components/Header";
import Link from "next/link";
import Image from "next/image";
import { Globalfilter } from "../components/Globalfilter";
import YearSelection from "../components/yeardropdown";
import {BiChevronDown, BiChevronUp} from "react-icons/bi";
import PieChart from "../components/dailystatsGraph";
import YearlyStats from "../components/yearlystatstable";
import LineGraph from "../components/lineGraph";

const ScansForYear = () => {
  const currentYear = new Date().getFullYear();
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useUser();
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [selectedYear, setSelectedYear]= useState(currentYear);
  const [fullData, setFullData] = useState([]); // Store all the data
  const [visibleData, setVisibleData] = useState([]); // Data currently visible in the table
  const [isLoading, setIsLoading] = useState(false); // Loading indicator
  const [hasMore, setHasMore] = useState(true); // Whether more data is available
  const PAGE_SIZE = 50;
  const tableRef = useRef(null);
  const [chartData, setChartData]= useState([]);
  const [lineData, setLineData]= useState([]);

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
        Header: "#Pages",
        accessor: "pages_scanned",
      },
      {
        Header: "Identifier",
        accessor: "ID_url",
        Cell: ({ row }) => (
          <a
            href={row.original.ID_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              maxWidth: "180px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {row.original.ID_url.split("details/")[1]}
          </a>
        ),
      },
      {
        Header:"Correction",
        accessor:"correction"
      },
      {
        Header: "Author",
        accessor: "author_name",
      },
      {
        Header: "Publisher",
        accessor: "publisher_name",
      },
      {
        Header: "Year",
        accessor: "year",
      },
      {
        Header: "ISBN",
        accessor: "isbn",
      },
      {
        Header: "Language",
        accessor: "language",
      },
    ],
    []
  );

  const fetchYearStats = async()=>{
    try{
      const response = await fetch(
        `https://trackserv.techfiz.com/api/v1/admin/getStatisticsForYear/${selectedYear}`
      );
      if(!response.ok){
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const fetchedData = await response.json();
      
      if (fetchedData.pagesScannedThisYear && fetchedData.pagesScannedThisYear.length > 0) {
        const pieChartData = fetchedData.pagesScannedThisYear.map((item) => ({
          name: item.month,
          pagesScanned: item.count
        }));
        setChartData(pieChartData);
    } else {
      setChartData([]);
     }   
    
    }catch(error){
      console.error("Error fetching data:", error.message);
    }
  };

  const fetchAllYearStats = async()=>{
    try{
      console.log("year");
      const response = await fetch(
        `https://trackserv.techfiz.com/api/v1/admin/getYearlyStatistics`
      );
      if(!response.ok){
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const fetchedData = await response.json();
      
      if (fetchedData.pagesScannedThisYear && fetchedData.pagesScannedThisYear.length > 0) {
        const LineChartData = fetchedData.pagesScannedThisYear.map((item) => ({
          year: item.year,
          data: item.data.map(month=>month.count)
        }));
        setLineData(LineChartData);
    } else {
      setLineData([]);
     }   
    
    }catch(error){
      console.error("Error fetching data:", error.message);
    }
  };

  const fetchData = async () => {
    try {
      setIsLoadingStats(true);

      const response = await fetch(
        "https://trackserv.techfiz.com/api/v1/admin/viewbooks-month"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const fetchedData = await response.json();

      const sortedData = fetchedData.sort((a, b) => {
        if (a.scanned_at !== b.scanned_at) {
          return new Date(b.scanned_at) - new Date(a.scanned_at);
        } else {
          return a.userName.localeCompare(b.userName);
        }
      });

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
          const formattedDate = new Date(rowValue).toLocaleDateString("en-US");
          return formattedDate.includes(filterValue);
        }
        return false;
      });
    });
  };
    const handleScroll = () => {
        const element = tableRef.current;
        // Check if the scroll position is near the bottom
        if ((element.scrollHeight - element.scrollTop).toFixed(0)-5 < element.clientHeight && hasMore) {
            fetchMoreData();
        }
    };

    useEffect(()=>{
      fetchYearStats().then();
    },[selectedYear]);

    useEffect(()=>{
      fetchAllYearStats().then();
      console.log(lineData);
    },[]);
    useEffect(() => {
    
      setChartData(chartData);
      
    }, [chartData]);

    useEffect(() => {
        const element = tableRef.current;

        if (element) {

            element.addEventListener('scroll', handleScroll);

            return () => {
                element.removeEventListener('scroll', handleScroll);
            };
        }
    }, ); // Add dependencies as needed
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    state: { globalFilter },
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data: visibleData,
      filterTypes: {
        datetime: filterByDates,
      },
    },
    useGlobalFilter,
    useSortBy
  );

  const scrollToTop = () => {
      const element = tableRef.current
      if (element) {
          element.scrollTo({
              top: 0,
              behavior: "smooth",
          });
      }
  };
  const scrollToBottom = () => {
      const element = tableRef.current
      if (element) {
          element.scrollTo({
              top: element.scrollHeight,
              behavior: "smooth",
          });
      }
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
            <h1 className="custom-heading">Yearly Stats</h1>
          </div>
          <div className="flex flex-row items-center justify-center">
              <div className="mb-8 h-full">
               
                <LineGraph data ={lineData}/>
                <YearlyStats/>
              </div>
              
            </div>
          
          {/* <div className="flex flex-row items-center justify-center">
          <YearSelection selectedYear={selectedYear} setSelectedYear={setSelectedYear}/>
              <div className="mb-4 ml-8 h-full">
               
                <PieChart data={chartData} />
              </div>
              
            </div> */}
           
            <div style={{ marginTop: "50px" }}>
            <h1 className="custom-heading">Digitization Books Stats</h1>
          </div>
          <div className="flex justify-end mb-4 text-sky-800 mr-8">
            <Globalfilter
              filter={globalFilter}
              setFilter={setGlobalFilter}
              className="mr-8"
            />
          </div>
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
            <button
              onClick={scrollToTop}
              className="bg-sky-800 hover:bg-sky-600 text-white py-1 px-1 rounded fixed bottom-20 right-2"
            >
                <BiChevronUp className={"h-5 w-5"}/>

            </button>
              <button
              onClick={scrollToBottom}
              className="bg-sky-800 hover:bg-sky-600 text-white py-1 px-1 rounded fixed bottom-10 right-2"
            >
                <BiChevronDown className={"h-5 w-5"}/>

            </button>

          </div>
        </>
      )}
    </>
  );
};

export default ScansForYear;
