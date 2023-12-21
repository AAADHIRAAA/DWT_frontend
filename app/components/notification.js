// import React, { useState,useEffect } from 'react';

// const ReminderNotification = () => {
//   const [showReminder, setShowReminder] = useState(true);

//   const handleReminderClose = () => {
//     setShowReminder(false);
//   };

//   useEffect(() => {
    
//     const showBetween5To7PM = () => {
//       const now = new Date();
//       const currentHour = now.getHours();
     
//       if (currentHour >= 17 && currentHour < 19) {
//         setShowReminder(true);
//       } else {
//         setShowReminder(false);
//       }

//       const reminderInterval = setInterval(() => {
//         setShowReminder(true);
//       }, 5 * 60 * 1000); 

//       return () => clearInterval(reminderInterval);
//     };

//     showBetween5To7PM(); 
//   }, []);

//   return (
//     <>
//       {showReminder && (
//         <div className="notification">
//           <p className='text-sky-800'>Remember to end your day and log out!</p>
//           <button onClick={handleReminderClose} className='px-2 py-2 rounded bg-sky-800 hover:bg-sky-600 text-white '>Close</button>
//         </div>
//       )}
//     </>
//   );
// };

// export default ReminderNotification;
