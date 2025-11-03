import React, { useState, useEffect, useRef } from 'react';

function PrefixTable() {
    const [data, setData] = useState([]);
    const [headerData, setHeaderData] = useState([]);
    const [changes, setChanges] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [toast, setToast] = useState(null);
    const containerRef = useRef(null);
    

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
};

const clearSearch = () => setSearchQuery('');

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

const trackChange = (row, col, value) => {
    setChanges(prev => ({
        ...prev,
        [`${row}-${col}`]: { row, col, value }
    }));
};

const trackNewRow = (newRowData) => {
    setChanges(prev => ({
        ...prev,
        [`new-row-${Date.now()}`]: { type: 'newRow', data: newRowData }
    }));
};

const trackNewColumn = (colIndex) => {
    setChanges(prev => ({
        ...prev,
        [`new-col-${colIndex}`]: { type: 'newColumn', colIndex }
    }));
};

const scrollToBottom = () => {
    if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
};

const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
};

const addNewRow = () => {
    const newRow = new Array(headerData.length).fill('');
    if (data.length === 0) {
        setData([newRow]);
        trackNewRow(newRow);
        setTimeout(scrollToBottom, 50);
        return;
    }
    setData(prev => [...prev, newRow]);
    trackNewRow(newRow);
    setTimeout(scrollToBottom, 50);
};

const addNewColumn = () => {
    const newHeaders = [...headerData, `Header ${headerData.length + 1}`];
    setHeaderData(newHeaders);
    const newData = data.map(row => [...row, '']);
    setData(newData);
    trackNewColumn(headerData.length);
};

const saveChanges = async () => {
    try {
        const response = await fetch('https://trackserv.techfiz.com/api/v1/admin/save-table', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ changes: Object.values(changes) }),
        });
        const result = await response.json().catch(() => ({}));
        if (response.ok) {
            showToast(result.message || 'Saved successfully', 'success');
            setChanges({});
        } else {
            showToast(result.message || 'Save failed', 'error');
        }
    } catch (err) {
        console.error(err);
        showToast(err.message || 'Save failed', 'error');
    }
};

useEffect(() => {
  fetchTableData();
}, []);

    return (
    <div className="p-4 gap-5" style={{width: '80%'}}>
       

         <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-3">
                <button onClick={addNewRow} className="px-2 py-1 bg-sky-600 text-white rounded hover:bg-sky-700">Add Row</button>
                <button onClick={addNewColumn} className="px-2 py-1 bg-sky-600 text-white rounded hover:bg-sky-700">Add Column</button>
            </div>

            <div className="flex items-center">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search..."
                    className="mb-0 p-2 border border-sky-600 rounded-md text-m w-64"
                />
                {searchQuery && (
                    <button onClick={clearSearch} className="ml-2 text-gray-600 px-2" aria-label="clear search">×</button>
                )}
            </div>

            <div>
                <button onClick={saveChanges} className="px-3 py-2 bg-sky-700 text-white rounded hover:bg-sky-800">Save Changes</button>
            </div>
         </div>

         <div className="flex justify-center">
            <div ref={containerRef} className={`max-h-[70vh] overflow-y-auto border border-blue-600 ${headerData.length > 6 ? 'overflow-x-auto' : ''}`}>
                <table className="w-full p-1 table-auto min-w-[1500px]">
                    <thead>
                        <tr>
                            {headerData.map((header, colIndex) => (
                                <th key={colIndex} className="sticky top-0 z-10 bg-sky-600">
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
                        {data
                            .map((row, rowIndex) => ({ row, rowIndex }))
                            .filter(({ row }) => {
                                if (!searchQuery) return true;
                                return row.some(cell => (cell || '').toLowerCase().includes(searchQuery));
                            })
                            .map(({ row, rowIndex }) => (
                                <tr key={rowIndex}>
                                    {row.map((cell, colIndex) => (
                                        <td key={colIndex} className="border border-blue-600 ">
                                            <input
                                                type="text"
                                                value={cell}
                                                onChange={(e) => handleInputChange(e, rowIndex, colIndex)}
                                                className="w-full text-center border-none outline-none"
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                    </tbody>
                      {toast && (
                        <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                            {toast.message}
                        </div>
                    )}
                </table>
            </div>
         </div>
    </div>
);
}

export default PrefixTable;
