import React, { useState, useEffect } from 'react';

function PrefixTable() {
    const [data, setData] = useState([]);
    const [headerData, setHeaderData] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); 
    const [filteredData, setFilteredData] = useState([]);
    

const fetchTableData = async () => {
  try {
      const response = await fetch('https://trackserv.techfiz.com/api/v1/users/getPrefix');
      if (response.ok) {
        const tableData = await response.json();
        const headers = tableData.headers || [];
        const data = tableData.data.map(row => {
            const cells = row.cells || [];
            while (cells.length < headers.length) {
                cells.push(''); // Add empty strings for missing cells
            }
            return cells;
        });
        setHeaderData(headers);
        setData(data);
        setFilteredData(data);
      } else {
          console.error('Failed to fetch table data');
      }
  } catch (error) {
      console.error('Error fetching table data:', error);
  }
};

const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (query === '') {
        setFilteredData(data);
    } else {
        // Filter data based on the search query
        const filtered = data.filter(row =>
            row.some(cell => cell.toLowerCase().includes(query))
        );
        setFilteredData(filtered);
    }
};

useEffect(() => {
  fetchTableData();
}, []);

return (
    <div className="p-4 gap-5">
         <div className='flex justify-center align-middle gap-5 '>
        <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search..."
                className="mb-5 p-2 border border-sky-600 rounded-md w-4/5"
            />
         </div>
   
        <table className="min-w-full p-1 border border-blue-600">
            <thead>
                <tr>
                    {headerData.map((header, colIndex) => (
                        <th key={colIndex} className="bg-sky-600">
                            <input
                                type="text"
                                value={header}
                                className="w-full bg-sky-600 text-center border-none outline-none"
                            />
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {filteredData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((cell, colIndex) => (
                            <td key={colIndex} className="border border-blue-600 ">
                                <input
                                    type="text"
                                    value={cell}
                                    className="w-full text-center border-none outline-none"
                                />
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
}

export default PrefixTable;
