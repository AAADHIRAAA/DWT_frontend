import React, {useState, useEffect, useRef} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/app/components/ui/dialog"
import {ScrollArea, ScrollBar} from "@/app/components/ui/scroll-area";
import {Minus} from "lucide-react";
import MonthSelection from "../components/monthdropdown";
import YearSelection from "../components/yeardropdown";
const DialogBox = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() +1) ;
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [weekOff, setWeekOff] = useState(0);
    const [holidays, setHolidays] = useState([]);

    const date = new Date(selectedYear,selectedMonth-1,1);

  const getCurrentMonthStartDate = () => {
    
    return new Date(selectedYear, selectedMonth-1, 1);
  };

  const getCurrentMonthEndDate = () => {
  
    return new Date(selectedYear, selectedMonth, 0);
  };

    const addHoliday = () => {
        setHolidays([...holidays, {date: date, name: ""}]);
    };

   
    const getNumberOfSundays = () => {
  
        const firstDayOfMonth = new Date(selectedYear, selectedMonth-1, 1);
        const lastDayOfMonth = new Date(selectedYear, selectedMonth , 0);
       
        let numberOfSundays = 0;
      
        for (let date = firstDayOfMonth; date <= lastDayOfMonth; date.setDate(date.getDate() + 1)) {
          if (date.getDay() === 0) {
            numberOfSundays++; 
          }
        }
    
      
       setWeekOff(numberOfSundays);
   
        return numberOfSundays;
        
      };
      
    const handleHolidayChange = (index, field, value) => {
        const updatedHolidays = [...holidays];
        updatedHolidays[index][field] = value;
        setHolidays(updatedHolidays);
    };

    const getHolidays = async () => {
        const response = await fetch(`https://trackserv.techfiz.com/api/v1/admin/monthlyholidays/${selectedMonth}/${selectedYear}`)
        console.log("HOLIDAY");
        console.log(selectedYear,selectedMonth);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const holidayData = await response.json()
        if (holidayData!=null) {
            

            const formattedData = holidayData?.holidays.map(item => ({
                date: new Date(item.holidayDate),
                name: item.holidayName
            }));

            // Set the formatted data to the state
            setHolidays(formattedData);
        }else{
            setHolidays([]);
            
        }

    }
    const handleRemove = (index)=>{
        const updatedHolidays = [...holidays.slice(0, index), ...holidays.slice(index + 1)]
        setHolidays(updatedHolidays);

    }

    const handleSubmit = async () => {
        try {
            const data = {
                year:selectedYear,
                month: selectedMonth,
                weekOff: weekOff,
                holidays: holidays.filter((holiday) => holiday.date && holiday.name),
            };

            console.log(selectedYear,selectedMonth);
            const response = await fetch("https://trackserv.techfiz.com/api/v1/admin/month", {
                method: "POST", headers: {
                    "Content-Type": "application/json",
                }, body: JSON.stringify(data),
            });
                
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            setIsOpen(false)
            console.log("Data submitted successfully:", await response.json());
        } catch (error) {
            console.error("Error submitting data:", error.message);
        }
    };

   
    useEffect(() => {
        if(selectedMonth ){
      
            getHolidays().then();
            
        }

    }, [selectedMonth,selectedYear, isOpen])

    useEffect(() => {
       
        getNumberOfSundays();
            
    }, [selectedMonth,selectedYear, isOpen])

    return (
        <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
        <DialogTrigger className="text-sky-600">
           <button className={" text-black "}>Holidays</button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
                <DialogTitle>Add Holiday Info</DialogTitle>
                <div className="flex flex-row gap-2 text-black-900">
                <MonthSelection selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth}/>
              <YearSelection selectedYear={selectedYear} setSelectedYear={setSelectedYear}/>
                </div>
                
            </DialogHeader>
         
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-3 items-center gap-4">
                    <label htmlFor="name" className="text-right c">
                        Week Off (s) : 
                    </label>
                    <input
                        id="name"
                        value={weekOff}
                        className="col-span-2 bg-blue-100 rounded-2xl p-2"
                        readOnly
                    />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                        <span className=" font-bold text-center col-span-3 text-sky-800">
                          Holidays
                        </span>
                </div>
                <div className={" overflow-auto max-h-[40vh]"}>
                    <div id={"holidays"}>
                        {holidays.map((holiday, index) => (
                            <div className={"flex flex-row justify-center align-middle items-center"}>

                                <div key={index} className="flex flex-col m-3">
                                    <div className="grid grid-cols-3 m-2">
                                        <label>Date:</label>
                                        <div className={" col-span-2"}>
                                        <DatePicker

                                            selected={holiday.date}
                                            onChange={(date) => handleHolidayChange(index, "date", date)}
                                            dateFormat="MM/dd/yyyy"
                                            minDate={getCurrentMonthStartDate()}
                                            maxDate={getCurrentMonthEndDate()}
                                        />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 ">
                                        <label>Name:</label>
                                        <input
                                            className="border border-gray-300 rounded-md p-1 col-span-2"
                                            value={holiday.name}
                                            onChange={(e) => handleHolidayChange(index, "name", e.target.value)}
                                        ></input>
                                    </div>
                                </div>
                                <div>
                                    <button onClick={()=>handleRemove(index)}><Minus className={"rounded-xl bg-blue-300"}/> </button>
                                </div>
                            </div>))}
                    </div>
                </div>
                <button
                    type="button"
                    className="border border-gray-300 bg-sky-800 hover:bg-sky-600 text-white rounded-md px-2 py-1 w-20 ml-auto"
                    onClick={addHoliday}
                >
                    Add
                </button>

            </div>
            <DialogFooter>
                <button
                    type="button"
                    className="border border-gray-300 bg-sky-800 hover:bg-sky-600 text-white rounded-md px-2 py-1 mb-2 w-20 ml-auto mr-auto"
                    onClick={handleSubmit}
                >
                    Update
                </button>
            </DialogFooter>
        </DialogContent>
    </Dialog>)

};

export default DialogBox;
