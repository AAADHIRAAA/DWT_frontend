"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Header from "../components/Header";
import DashboardContainer from "../components/dashboardContainer";
import LeaderBoard from "../components/leaderboard";
import PrevDay from "../prevday/page";
import MonthLeaderBoard from "../components/monthleaderboard";
import FilterOptions from "../components/locationFilter";

const Dashboard = () => {
  const [booksScanned, setBooksScanned] = useState(0);
  const [pagesScanned, setPagesScanned] = useState(0);
  const [authorCount, setAuthorCount] = useState(0);
  const [publisherCount, setPublisherCount] = useState(0);
  const [booksScannedMonth, setBooksScannedMonth] = useState(0);
  const [pagesScannedMonth, setPagesScannedMonth] = useState(0);
  const [authorCountMonth, setAuthorCountMonth] = useState(0);
  const [publisherCountMonth, setPublisherCountMonth] = useState(0);
  const [filterOption, setFilterOption] = useState('Gandhi Bhavan');

  const fetchDataMonth = async () => {
    try {
      const response = await fetch(
        "https://trackserv.techfiz.com/api/v1/admin/statistics-for-month"
      );
      const data = await response.json();
      console.log("Fetched data:", data);
      setBooksScannedMonth(data.booksScannedThisMonth);
      setPagesScannedMonth(data.pagesScannedThisMonth);
      setAuthorCountMonth(data.distinctAuthorsThisMonth);
      setPublisherCountMonth(data.distinctPublishersThisMonth);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };
  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://trackserv.techfiz.com/api/v1/books/statistics-for-date"
      );
      const data = await response.json();

      setBooksScanned(data.booksScannedToday);
      setPagesScanned(data.pagesScannedToday);
      setAuthorCount(data.distinctAuthors);
      setPublisherCount(data.distinctPublishers);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  const handleFilter = (option) => {
    setFilterOption(option);
  };
  // Use the useEffect hook to fetch data when the component mounts
  useEffect(() => {
    fetchData();
    // Fetch data every minute (adjust the interval as needed)
    const intervalId = setInterval(fetchData, 60 * 10 * 1000);
    
    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  useEffect(()=>{
    fetchDataMonth();
    const interval = setInterval(fetchDataMonth, 60 * 10 * 1000);
    return ()=> clearInterval(interval);
  },[]);

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Header />
      <div className="text-center mt-8">
        <h1 className="custom-heading">Digitization Stats</h1>
      </div>
      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <DashboardContainer title="Books Scanned" count={booksScanned} total={booksScannedMonth}/>
        <DashboardContainer title="Pages Scanned" count={pagesScanned} total={pagesScannedMonth}/>
        <DashboardContainer title="Author Count" count={authorCount} total={authorCountMonth}/>
        <DashboardContainer title="Publisher Count" count={publisherCount} total={publisherCountMonth}/>
      </div>
      <div className="flex justify-center">
        <FilterOptions onFilter={handleFilter} />
   </div>
      <div className="mt-8 mb-12 flex-col gap-3">
      <h3 className="custom-heading">Daily Leaderboard</h3>
        <LeaderBoard location={filterOption} />
      </div>
      <div className="mt-8 mb-12 flex flex-col gap-3">
      <h3 className="custom-heading">Month Leaderboard</h3>
        <MonthLeaderBoard location={filterOption} />
      </div>
      
      <h3 className="custom-heading">Previous Day Stats</h3>

      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <PrevDay />
      </div>
      <button
        onClick={scrollToBottom}
        className="bg-sky-800 hover:bg-sky-600 text-white font-semibold py-1 px-1 rounded fixed bottom-10 right-2"
      >
        <Image src="/scroll-down.png" alt="Scrolldown" width={20} height={20} />
      </button>
    </>
  );
};

export default Dashboard;
