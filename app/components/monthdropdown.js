
"use client"
import { useState,useEffect } from 'react';

const MonthSelection = ({selectedMonth, setSelectedMonth}) => {

 
  const handleSelectionChange = (event) => {
    const newSelectedMonth = event.target.value;
    setSelectedMonth(newSelectedMonth);
  };
  

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh'}}>
      <div className="text-sky-600" style={{ display:"flex", flexDirection:"row",textAlign: 'center', width: '200px', border: '1px solid #ccc', padding: '15px', borderRadius: '12px' }}>
        <h2 style={{ margin: '0' }}>Month</h2>
        <select
          value={selectedMonth}
          onChange={handleSelectionChange}
          style={{  marginLeft: '10px',  borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">Select</option>
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
          
        </select>
       
      </div>
    </div>
  );
};


export default MonthSelection;
