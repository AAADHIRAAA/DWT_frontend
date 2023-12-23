"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Header from "../components/Header";
import DashboardContainer from "../components/dashboardContainer";
import LeaderBoard from "../components/leaderboard";
import PrevDay from "../prevday/page";

const Dashboard = () => {
  const [booksScanned, setBooksScanned] = useState(0);
  const [pagesScanned, setPagesScanned] = useState(0);
  const [authorCount, setAuthorCount] = useState(0);
  const [publisherCount, setPublisherCount] = useState(0);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://localhost:5200/api/v1/books/statistics-for-date"
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

  // Use the useEffect hook to fetch data when the component mounts
  useEffect(() => {
    fetchData();
    // Fetch data every minute (adjust the interval as needed)
    const intervalId = setInterval(fetchData, 60 * 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

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
        <DashboardContainer title="Books Scanned" count={booksScanned} />
        <DashboardContainer title="Pages Scanned" count={pagesScanned} />
        <DashboardContainer title="Author Count" count={authorCount} />
        <DashboardContainer title="Publisher Count" count={publisherCount} />
      </div>

      <div className="mt-8 mb-12">
        <LeaderBoard />
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
