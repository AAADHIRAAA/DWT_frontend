// const SHEET_ID = "17bSOKh06XUIMvwHFWqE5lcNPZyB4Yn2dqlB83ESBhHU";
// const GoogleSheetComponent = () => {
//     return (
//       <iframe
//         src={`https://docs.google.com/spreadsheets/d/${SHEET_ID}/pubhtml?widget=true&amp;headers=false`}
//         width="80%"
//         height="800"
//         frameborder="10"
       
//       ></iframe>
//     );
//   };
  
//   export default GoogleSheetComponent;

import React, { useState, useEffect } from 'react';

function DynamicTable() {
   
    const [data, setData] = useState([]);
    const [headerData, setHeaderData] = useState([]);
    const [changes, setChanges] = useState({});
    const [searchQuery, setSearchQuery] = useState(''); 
    const [filteredData, setFilteredData] = useState([]);

   
    const handleInputChange = (e, rowIndex, colIndex) => {
        const newData = [...data];
        newData[rowIndex][colIndex] = e.target.value;
        setData(newData);
        trackChange(rowIndex, colIndex, e.target.value);
    };

    const handleHeaderChange = (e, colIndex) => {
        const newHeaders = [...headerData];
        newHeaders[colIndex] = e.target.value;
        setHeaderData(newHeaders);
        trackChange('header', colIndex, e.target.value);
    };

    const handleKeyDown = (e, rowIndex) => {
        if (e.key === 'Enter' && rowIndex === data.length - 1) {
            addNewRow();
        }
    };

    const addNewRow = () => {
      const newRow = new Array(headerData.length).fill('');
      setData([...data, newRow]);
      trackNewRow(newRow); 
  };

    const addNewColumn = () => {
        const newHeaders = [...headerData, `Header ${headerData.length + 1}`];
        setHeaderData(newHeaders);

        const newData = data.map(row => [...row, '']);
        setData(newData);
        trackNewColumn(headerData.length);
    };
    const removeLastColumn = () => {
      if (headerData.length > 1) {
          const lastIndex = headerData.length - 1;
    
          const newHeaders = headerData.slice(0, -1);
          setHeaderData(newHeaders);
    
          const newData = data.map(row => row.slice(0, -1));
          setData(newData);
    
          // Track the removal of the last column
          trackColumnRemoval(lastIndex);
      }
    };

  const trackChange = (row, col, value) => {
    setChanges(prevChanges => {
        const key = `${row}-${col}`;
        return {
            ...prevChanges,
            [key]: { row, col, value }
        };
    });
};

const trackNewRow = (newRowData) => {
    setChanges(prevChanges => ({
        ...prevChanges,
        [`new-row-${Date.now()}`]: { type: 'newRow', data: newRowData }
    }));
};

const trackNewColumn = (colIndex) => {
    setChanges(prevChanges => ({
        ...prevChanges,
        [`new-col-${colIndex}`]: { type: 'newColumn', colIndex }
    }));
};

const trackColumnRemoval = (removedIndex) => {
  setChanges(prevChanges => ({
      ...prevChanges,
      [`remove-col-${removedIndex}`]: { type: 'removeColumn', colIndex: removedIndex }
  }));
};

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
const saveChanges = () => {
  console.log('Changes to be saved:', changes);

  fetch('https://trackserv.techfiz.com/api/v1/admin/save-table', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ changes: Object.values(changes) }),
  })
  .then(response => response.json())
  .then(result => console.log('Success:', result))
  .catch(error => console.error('Error:', error));

  // Clear the changes after saving
  setChanges({});
};

useEffect(() => {
  fetchTableData();
}, []);

    return (
        <>
  
            <div className="p-4 gap-5">
        <div className='flex justify-center align-middle gap-5 '>
        <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search..."
                className="mb-2 p-2 border border-sky-600 rounded-md w-full"
            />
         <button
              onClick={saveChanges}
              className="mb-2 px-2 py-2 bg-sky-600 text-white rounded hover:bg-sky-800"
          >
              Save
          </button>
          </div>
        <div className='flex flex-row justify-center align-middle gap-3'>
          <h4>Column: </h4>
          <button
              onClick={addNewColumn}
              className="mb-2 px-1 py-1 bg-sky-600 text-white rounded hover:bg-sky-800"
          >
              +
          </button>
          <button
              onClick={removeLastColumn}
              className="mb-2 px-1 py-1 bg-sky-600 text-white rounded hover:bg-sky-800"
          >
              -
          </button>
          </div>
          <table className="min-w-full p-1 border border-blue-600">
              <thead>
                  <tr>
                      {headerData.map((header, colIndex) => (
                          <th key={colIndex} className="bg-sky-600">
                              <input
                                  type="text"
                                  value={header}
                                  onChange={(e) => handleHeaderChange(e, colIndex)}
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
                                      onChange={(e) => handleInputChange(e, rowIndex, colIndex)}
                                      onKeyDown={(e) => handleKeyDown(e, rowIndex)}
                                      className="w-full text-center border-none outline-none"
                                  />
                              </td>
                          ))}
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
    
      
      </>
  );
}

export default DynamicTable;
