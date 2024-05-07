"use client";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Link from "next/link";
import DashboardContainer from "../components/dashboardContainer";
import DialogBox from "../components/holidaymonthstats";
import { useUser } from "@clerk/nextjs";

const MonthStats = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [booksScanned, setBooksScanned] = useState(0);
  const [pagesScanned, setPagesScanned] = useState(0);
  const [authorCount, setAuthorCount] = useState(0);
  const [publisherCount, setPublisherCount] = useState(0);
  const { user } = useUser();

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://trackserv.techfiz.com/api/v1/admin/statistics-for-month"
      );
      const data = await response.json();
      console.log("Fetched data:", data);
      setBooksScanned(data.booksScannedThisMonth);
      setPagesScanned(data.pagesScannedThisMonth);
      setAuthorCount(data.distinctAuthorsThisMonth);
      setPublisherCount(data.distinctPublishersThisMonth);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  useEffect(() => {
    if (user) {
      const userRole = user.publicMetadata.userRole;
      setIsAdmin(userRole === "admin");
    }
  }, [user]);
  // Use the useEffect hook to fetch data when the component mounts
  useEffect(() => {
    fetchData();

    // Fetch data every minute (adjust the interval as needed)
    const intervalId = setInterval(fetchData, 60 * 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      {!isAdmin && (
        <>
          <div className="text-center mt-20">
            <h1 className="text-3xl text-black">This Page is restricted</h1>
          </div>
          <div className="text-center mt-20">
            <Link href="/workreport">Return to Homepage</Link>
          </div>
        </>
      )}
      {isAdmin && (
        <>
          <Header />
          <div className="text-center mt-10">
            <h1 className="custom-heading">Accounts Menu</h1>
          </div>
          
          <div className="flex justify-center mt-10 space-x-4">
            
          <div
              style={{
                textAlign: "center",
                display: "inline-block",
                marginLeft: "40px",
                height: "80px",
                width: "200px", // Set the width of the container
                borderRadius: "8px", // Add border-radius for rounded corners
                boxShadow: "8px 10px 16px rgba(0.2, 0.1, 0.1, 0.2)", // Add box shadow
                backgroundColor: "#075985",
                marginBottom: "40px",
              }}
            >
              <Link href="/scanAgent">
                <h1
                  style={{
                    color: "white",
                    marginTop: "20px",
                    fontSize: "20px",
                  }}
                >
                  ScanAgent Details
                </h1>
              </Link>
            </div>

            <div
              style={{
                textAlign: "center",
                display: "inline-block",
                marginLeft: "40px",
                height: "80px",
                width: "200px", // Set the width of the container
                borderRadius: "8px", // Add border-radius for rounded corners
                boxShadow: "8px 10px 16px rgba(0.2, 0.1, 0.1, 0.2)", // Add box shadow
                backgroundColor: "#075985",
                marginBottom: "40px",
              }}
            >
              <Link href="/paymentStats">
                <h1
                  style={{
                    color: "white",
                    marginTop: "20px",
                    fontSize: "20px",
                  }}
                >
                  Payment Stats
                </h1>
              </Link>
            </div>
           
            <div
              style={{
                textAlign: "center",
                display: "inline-block",
                marginLeft: "40px",
                height: "80px",
                width: "200px", // Set the width of the container
                borderRadius: "8px", // Add border-radius for rounded corners
                backgroundColor: "#075985",
                boxShadow: "8px 10px 16px rgba(0.2, 0.1, 0.1, 0.2)", // Add box shadow
                marginBottom: "40px",
              }}
            >
            
                <h1
                  style={{
                    color: "white",
                    marginTop: "20px",
                    fontSize: "20px",
                  }}
                >
                <DialogBox />
                </h1>
            
            </div>
            
          </div>
        </>
      )}
    </>
  );
};

export default MonthStats;
