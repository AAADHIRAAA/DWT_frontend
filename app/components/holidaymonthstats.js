import React, { useState,useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
const DialogBox = () => {
  const [isOpen, setIsOpen] = useState(false);
   
    const [weekOff, setWeekOff] = useState('');
    const [holidays, setHolidays] = useState([{ date: new Date(), name: '' }]);
    const currentDate= new Date();
    const currentMonth = currentDate.getMonth()+1;

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };


const addHoliday=()=>{
    setHolidays([...holidays, { date: new Date(), name: '' }]);
}

const handleWeekOffChange = (e) => {
    setWeekOff(e.target.value);
  };

const handleHolidayChange = (index, field, value) => {
    const updatedHolidays = [...holidays];
    updatedHolidays[index][field] = value;
    setHolidays(updatedHolidays);
  };
 
const handleSubmit = async () => {
    try {
     
      const data = {
        month:currentMonth,
        weekOff: weekOff,
        holidays: holidays.filter((holiday) => holiday.date && holiday.name),
      };
      console.log(data);

      const response = await fetch('https://digitized-work-tracker-backend.vercel.app/api/v1/admin/month', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log('Data submitted successfully:', data);
    } catch (error) {
      console.error('Error submitting data:', error.message);
    }
  };

  return (
    <div>
      <button onClick={openDialog} className='text-sky-600'>Current Month : {currentMonth}</button>
      {isOpen && (
        <div className="dialog">
          <div className="dialog-content">
            <span onClick={closeDialog} className="close-button">
              &times;
            </span>
            <form className='flex flex-col gap-5 text-sky-600 border border-grey-600 rounded p-4 mb-4'>
                <div className='flex flex-row gap-5'>
                <label>Weekoff:</label>
                <input 
                className='border border-gray-300 rounded-md '
                value={weekOff}
                onChange={handleWeekOffChange}
                ></input>
                </div>
                {holidays.map((holiday, index) => (
                <div key={index} className="flex flex-col gap-5">
                  <div className="flex flex-row gap-5">
                    <label>Holiday Date:</label>
                    <DatePicker
                      selected={holiday.date}
                      onChange={(date) =>
                        handleHolidayChange(index, 'date', date)
                      }
                      dateFormat="MM/dd/yyyy"
                    />
                   
                  </div>
                  <div className="flex flex-row gap-5">
                    <label>Holiday Name:</label>
                    <input
                      className="border border-gray-300 rounded-md"
                      value={holiday.name}
                      onChange={(e) =>
                        handleHolidayChange(index, 'name', e.target.value)
                      }
                    ></input>
                  </div>
                </div>
              ))}
              <button type="button" 
              className="border border-gray-300 bg-sky-800 hover:bg-sky-600 text-white rounded-md px-2 py-1 w-20 ml-auto"
               onClick={addHoliday}>
                Add
              </button>
              <button type="button"
               className="border border-gray-300 bg-sky-800 hover:bg-sky-600 text-white rounded-md px-2 py-1 mb-2 w-20 ml-auto mr-auto"
                onClick={handleSubmit}>
                Update
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DialogBox;
