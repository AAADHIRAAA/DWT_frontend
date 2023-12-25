import React, {useState, useEffect, useRef} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/app/components/ui/dialog"
import {ScrollArea, ScrollBar} from "@/app/components/ui/scroll-area";
import {Minus} from "lucide-react";

const DialogBox = ({
                       action,
                       username,
                       payment,
                       totalWorkingDays,
                       leaves,
                        status,

                   }) => {
    const [isOpen, setIsOpen] = useState(false);

    const [bonus, setBonus] = useState(0);
    const [detect, setDetect] = useState(0);
    const [isBonusFieldVisible, setIsBonusFieldVisible] = useState(false);
    const [isDetectFieldVisible, setIsDetectFieldVisible] = useState(false);
    const [paid, setPaid]=useState(status);
    const [salary, setSalary]= useState(payment);
    const [ paidDate, setPaidDate] = useState(null);

    const handleBonusChange = (e) => {
        setBonus(Number(e.target.value));
        setSalary(salary+bonus)

    };
    const handleDetectChange = (e) => {
        setDetect(Number(e.target.value));
        setSalary(salary-detect);

    };

    const removeBonus = () => {
        setBonus(0);
        setIsBonusFieldVisible(false);

    };
    const removeDetect = () => {
        setDetect(0);
        setIsDetectFieldVisible(false);

    };
    const detectSalary = () => {
        setIsDetectFieldVisible(!isDetectFieldVisible);
        // const oneDaySalary = 333.333;
        // setSalary((prevSalary) => prevSalary - oneDaySalary);

    };


    const calculateUpdatedPayment = () => {

        const updatedPayment = payment + bonus - detect;
        return updatedPayment;
    };

    const updateStatus =()=>{
        setPaid("Paid");
        const currentDate = new Date().toLocaleDateString("en-US");
        setPaidDate(currentDate);

    }

    const savePayment = async () => {
        try {
            const data = {
               username:username,
                leaves:leaves,
                totalDays:totalWorkingDays,
                status:{paid},
                payment:{salary},
                date:{paidDate}
            };
            const response = await fetch(
                "https://digitized-work-tracker-backend.vercel.app/api/v1/admin/payment",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ data }),
                }
            );

            updateStatus();
            console.log("Data saved successfully!");
        } catch (error) {
            console.error("Error saving data:", error.message);
        }
    };

    const addBonus = () =>{
        setIsBonusFieldVisible(!isBonusFieldVisible);

    }

    return (
        <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
            <DialogTrigger className="text-sky-600">
                {action}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>User Payment Info</DialogTitle>

                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 items-center gap-4">

                        <p>Scan Agent: {username}</p>
                        <p>Payment: {salary}</p>
                        <p>Total Working Days: {totalWorkingDays}</p>
                        <p>Leaves Taken: {leaves}</p>
                        <p>Status: {paid}</p>
                        {paid!=="Not Paid" && (
                            <p>Date of Payment:{paidDate}</p>
                        )}
                        {paid!=="Paid" &&(
                            <>
                                <div className="grid grid-cols-3 items-center gap-4">
                        <span className=" font-bold text-center col-span-3">
                          Process payment

                        </span>
                          Payment: {salary}

                                </div>
                                <div className="flex flex-col gap-5 justify-center align-center">
                                    <button
                                        type="button"
                                        className="border border-gray-300 bg-sky-800 hover:bg-sky-600 text-white rounded-md px-2 py-2 w-30 "
                                        onClick={addBonus}
                                    >
                                        Add Bonus
                                    </button>
                                    {isBonusFieldVisible && (
                                    <div className={" overflow-auto max-h-[40vh]"}>
                                        <div id={"bonus-info"}>
                                            <div
                                                className={"flex flex-row justify-center align-middle items-center"}
                                            >
                                                <div className="flex flex-col m-3">
                                                    <div className="grid grid-cols-3">
                                                        <label>Bonus: </label>
                                                        <input
                                                            className="border border-gray-300 rounded-md p-1 col-span-2"
                                                            value={bonus}
                                                            onChange={handleBonusChange}
                                                        ></input>
                                                    </div>
                                                </div>
                                                <div>
                                                    <button onClick={removeBonus}>
                                                        <Minus className={"rounded-xl bg-blue-300"} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    )}
                                    <button
                                        type="button"
                                        className="border border-gray-300 bg-sky-800 hover:bg-sky-600 text-white rounded-md px-2 py-2 w-30 "
                                        onClick={detectSalary}
                                    >
                                        Detect Salary
                                    </button>
                                    {isDetectFieldVisible && (
                                        <div className={" overflow-auto max-h-[40vh]"}>
                                            <div id={"bonus-info"}>
                                                <div
                                                    className={"flex flex-row justify-center align-middle items-center"}
                                                >
                                                    <div className="flex flex-col m-3">
                                                        <div className="grid grid-cols-3">
                                                            <label>Detect: </label>
                                                            <input
                                                                className="border border-gray-300 rounded-md p-1 col-span-2"
                                                                value={detect}
                                                                onChange={handleDetectChange}
                                                            ></input>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <button onClick={removeDetect}>
                                                            <Minus className={"rounded-xl bg-blue-300"} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        className="border border-gray-300 bg-sky-800 hover:bg-sky-600 text-white rounded-md px-2 py-2 w-30 "
                                        onClick={savePayment}
                                    >
                                        Proceed to Pay
                                    </button>
                                </div>
                            </>
                        )}
                    </div>



                </div>
                {/*<DialogFooter>*/}
                {/*    <button*/}
                {/*        type="button"*/}
                {/*        className="border border-gray-300 bg-sky-800 hover:bg-sky-600 text-white rounded-md px-2 py-1 mb-2 w-20 ml-auto mr-auto"*/}
                {/*        onClick={handleSubmit}*/}
                {/*    >*/}
                {/*        Update*/}
                {/*    </button>*/}
                {/*</DialogFooter>*/}
            </DialogContent>
        </Dialog>)

};

export default DialogBox;
