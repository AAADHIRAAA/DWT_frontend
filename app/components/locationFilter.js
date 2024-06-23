"use client"
import React, {useState} from 'react';

const FilterOptions = ({ onFilter }) => {
  const [clickedButton, setClickedButton] = useState("Gandhi Bhavan");

  const handleFilter = (filterOption) => {
  
    onFilter(filterOption);
    setClickedButton(filterOption);
  };

  return (
    <div className="flex flex-row gap-2 mb-2 ml-2 align-center items-center text-sky-800">

        <button className={`rounded-lg border-2 border-gray-300  px-2 py-2 ${clickedButton === "Gandhi Bhavan" ? 'bg-gray-300' : 'hover:bg-gray-300'}`} onClick={()=> handleFilter("Gandhi Bhavan")}>Gandhi Bhavan</button>
        <button className={`rounded-lg border-2 border-gray-300  px-2 py-2 ${clickedButton === "Lalbagh Botanical Garden" ? 'bg-gray-300' : 'hover:bg-gray-300'}`} onClick={()=> handleFilter("Lalbagh Botanical Garden")}>Lalbagh Botanical Garden</button>
        
 
    </div>
  );
};

export default FilterOptions;
