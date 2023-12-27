import React, {useState, useEffect, useRef} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/app/components/ui/dialog"
import {ScrollArea, ScrollBar} from "@/app/components/ui/scroll-area";
import {Minus} from "lucide-react";

const DialogBox = ({selectedMonth}) => {
    const [isOpen, setIsOpen] = useState(false);

    const [weekOff, setWeekOff] = useState("0");
    const [holidays, setHolidays] = useState([]);


    const addHoliday = () => {
        setHolidays([...holidays, {date: new Date(), name: ""}]);
    };

    const handleWeekOffChange = (e) => {
        setWeekOff(e.target.value);
    };

    const handleHolidayChange = (index, field, value) => {
        const updatedHolidays = [...holidays];
        updatedHolidays[index][field] = value;
        setHolidays(updatedHolidays);
    };

    const getHolidays = async () => {
        const response = await fetch("https://digitized-work-tracker-backend.vercel.app/api/v1/admin/monthlyholidays/" + selectedMonth)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const holidayData = await response.json()
        if (holidayData!=null) {
            setWeekOff(holidayData.weekOff)

            const formattedData = holidayData?.holidays.map(item => ({
                date: new Date(item.holidayDate),
                name: item.holidayName
            }));

            // Set the formatted data to the state
            setHolidays(formattedData);
        }else{
            setHolidays([]);
            setWeekOff("0");
        }

    }
    const handleRemove = (index)=>{
        const updatedHolidays = [...holidays.slice(0, index), ...holidays.slice(index + 1)]
        setHolidays(updatedHolidays);

    }

    const handleSubmit = async () => {
        try {
            const data = {
                month: selectedMonth,
                weekOff: weekOff,
                holidays: holidays.filter((holiday) => holiday.date && holiday.name),
            };


            const response = await fetch("https://digitized-work-tracker-backend.vercel.app/api/v1/admin/month", {
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
        if(selectedMonth){
            getHolidays().then();
        }

    }, [selectedMonth, isOpen])
//   return (
//     <Dialog>
//       <DialogTrigger onClick={openDialog} className="text-sky-600">
//         Current Month : {currentMonth}
//       </DialogTrigger>
//           <DialogContent >
//             <form className="flex flex-col gap-5 text-sky-600 border border-grey-600 rounded p-4 mb-4">
//               <div className="flex flex-row gap-5">
//                 <label>Weekoff:</label>
//                 <input
//                   className="border border-gray-300 rounded-md "
//                   value={weekOff}
//                   onChange={handleWeekOffChange}
//                 ></input>
//               </div>
//               {holidays.map((holiday, index) => (
//                 <div key={index} className="flex flex-col gap-5">
//                   <div className="flex flex-row gap-5">
//                     <label>Holiday Date:</label>
//                     <DatePicker
//                       selected={holiday.date}
//                       onChange={(date) =>
//                         handleHolidayChange(index, "date", date)
//                       }
//                       dateFormat="MM/dd/yyyy"
//                     />
//                   </div>
//                   <div className="flex flex-row gap-5">
//                     <label>Holiday Name:</label>
//                     <input
//                       className="border border-gray-300 rounded-md"
//                       value={holiday.name}
//                       onChange={(e) =>
//                         handleHolidayChange(index, "name", e.target.value)
//                       }
//                     ></input>
//                   </div>
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 className="border border-gray-300 bg-sky-800 hover:bg-sky-600 text-white rounded-md px-2 py-1 w-20 ml-auto"
//                 onClick={addHoliday}
//               >
//                 Add
//               </button>
//               <button
//                 type="button"
//                 className="border border-gray-300 bg-sky-800 hover:bg-sky-600 text-white rounded-md px-2 py-1 mb-2 w-20 ml-auto mr-auto"
//                 onClick={handleSubmit}
//               >
//                 Update
//               </button>
//             </form>
//           </DialogContent>
//     </Dialog>
//   );

    return (
        <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
        <DialogTrigger className="text-sky-600">
           <button className={"bg-sky-950 rounded-md text-white p-2 hover:bg-sky-800"}>Set Holidays</button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
                <DialogTitle>Add Holiday Info</DialogTitle>

            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-3 items-center gap-4">
                    <label htmlFor="name" className="text-right c">
                        Week Off (s) :
                    </label>
                    <input
                        id="name"
                        placeholder={"Number Of Week Offs"}
                        defaultValue={weekOff}
                        onChange={handleWeekOffChange}
                        className="col-span-2 bg-blue-100 rounded-2xl p-2"
                    />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                        <span className=" font-bold text-center col-span-3">
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
