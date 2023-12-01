"use client"
import React,{useEffect, useState} from 'react';
import UserDashboardContainer from '../components/userdashboardContainer'; 
import { useUser } from '@clerk/nextjs';

const UserDashboard = () => {

  const [booksScannedToday, setBooksScannedToday] = useState(0);
  const [pagesScannedToday, setPagesScannedToday] = useState(0);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const {  user } = useUser();
  const [userId, setUserId] = useState(null);


  useEffect(() => {
    if (user) {
      setUserId(user.id);   
    }
    fetchData();
    const intervalId = setInterval(fetchData, 0.5 * 60 * 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
 }, [user,userId]);


    const fetchData = async () => {
      try {
        setIsLoadingStats(true);
        if(userId){
          const response = await fetch(`http://localhost:5200/api/v1/users/user-today-statistics/${userId}`);
          const data = await response.json();
          console.log('Fetched data:', data); 
          setBooksScannedToday(data.booksScannedToday);
          setPagesScannedToday(data.pagesScannedToday);
          setIsLoadingStats(false);
        }
        else{
          <div>Loading...</div>
        }
       
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

  return (
    <>
     
    <div style={{ textAlign: 'center' }}>
      <UserDashboardContainer title="Books Scanned" count={booksScannedToday} />
      <UserDashboardContainer title="Pages Scanned" count={pagesScannedToday} />
    </div>
    </>
  );
};



export default UserDashboard;