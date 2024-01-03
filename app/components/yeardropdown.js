"use client"

const YearSelection = ({selectedYear, setSelectedYear}) => {

 const currentYear = new Date().getFullYear();
 const endYear = 2023;
  const years = [];

  for (let year = currentYear; year >= endYear; year--) {
    years.push(year);
  }

  const handleSelectionChange = (event) => {
    const newSelectedYear = event.target.value;
    setSelectedYear(newSelectedYear);
  };
  

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh'}}>
      <div className="text-sky-600" style={{ display:"flex", flexDirection:"row",textAlign: 'center', width: '150px', border: '1px solid #ccc', padding: '15px', borderRadius: '12px' }}>
        <h2 style={{ margin: '0' }}>Year</h2>
        <select
          value={selectedYear}
          onChange={handleSelectionChange}
          style={{  marginLeft: '10px',  borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">Select</option>
        
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
          
        </select>
       
      </div>
    </div>
  );
};


export default YearSelection;
