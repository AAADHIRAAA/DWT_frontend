"use client";
import React, { useState, useEffect } from "react";
import DashboardContainer from "../components/dashboardContainer";

const PrevDay = () => {
  const [booksScanned, setBooksScanned] = useState(0);
  const [pagesScanned, setPagesScanned] = useState(0);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  useEffect(() => {
    fetchData();

    const intervalId = setInterval(fetchData, 60 * 10 * 1000);
    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const fetchData = async () => {
    try {
      setIsLoadingStats(true);

      const response = await fetch(
        "https://trackserv.techfiz.com/api/v1/books/statistics-prev-date"
      );
      const data = await response.json();
      console.log("Fetched data:", data);
      setBooksScanned(data.booksScannedPreviousDay);
      setPagesScanned(data.pagesScannedPreviousDay);
      setIsLoadingStats(false);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  return (
    <div>
      {!isLoadingStats ? (
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <DashboardContainer title="Books Scanned" count={booksScanned} />
          <DashboardContainer title="Pages Scanned" count={pagesScanned} />
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default PrevDay;
