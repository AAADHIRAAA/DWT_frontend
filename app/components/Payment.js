import React, {useState,useEffect} from "react";
import "react-datepicker/dist/react-datepicker.css";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from "@/app/components/ui/dialog"
import {Minus} from "lucide-react";
import {isNumber} from "util";

const DialogBox = ({
                       action,
                       userId,
                       username,
                       payment,
                       singleDaySalary,
                       totalWorkingDays,
                       leaves,
                        status,
                        date,
                        actualPayment,
                        handleButtonClick
                   }) => {
    const [isOpen, setIsOpen] = useState(false);

    const [bonus, setBonus] = useState(0);
    const [detect, setDetect] = useState(0);
    const [detectday, setDetectday] = useState(0);
    const [isBonusFieldVisible, setIsBonusFieldVisible] = useState(false);
    const [isDetectFieldVisible, setIsDetectFieldVisible] = useState(false);
    const [paid, setPaid]=useState(status);
    const [ paidDate, setPaidDate] = useState(date);
  
    const handleBonusChange = (e) => {
        if (!isNaN(Number(e))) {
            setBonus(Number(e));
            calculateUpdatedPayment();
        }
    };
    const handleDetectChange = (e) => {
        if (!isNaN(Number(e))) {
            setDetect(Number(e));
            calculateUpdatedPayment();
        }

    };
    const handleDetectDayChange = (e)=>{
        if(!isNaN(Number(e))){
            setDetectday(Number(e));
            calculateUpdatedPayment();
        }
    }

    const removeBonus = () => {
        setBonus(0);
        setIsBonusFieldVisible(false);
        calculateUpdatedPayment();

    };
    const removeDetect = () => {
        setDetect(0);
        setIsDetectFieldVisible(false);
        calculateUpdatedPayment();

    };
    const detectSalary = () => {
        setIsDetectFieldVisible(!isDetectFieldVisible);
        

    };


    const calculateUpdatedPayment = () => {

        return (payment + bonus - detect -detectday*singleDaySalary);
    };

    const updateStatus =()=>{
        setPaid("Paid");
        const currentDate = new Date().toLocaleDateString("en-US");
        setPaidDate(currentDate);
        savePayment();

    }
    const addBonus = () =>{
        setIsBonusFieldVisible(!isBonusFieldVisible);

    }

    const savePayment = async () => {

        const salary = calculateUpdatedPayment();
        try {
            const data = {
                userId:userId,
               username:username,
                leaves:leaves,
                totalDays:totalWorkingDays,
                payment:salary,
            };
            console.log(data)
            const response = await fetch(
                "https://trackserv.techfiz.com/api/v1/admin/payment",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ data }),
                }
            );
            console.log(response);
            handleButtonClick();
            console.log("Data saved successfully!");
        } catch (error) {
            console.error("Error saving data:", error.message);
        }
    };

    
   

    return (
        <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
            <DialogTrigger className="text-sky-600">
                <button className={"bg-sky-800 rounded-md text-white p-2 hover:bg-sky-600 w-20"}>{action}</button>

            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>User Payment Info</DialogTitle>

                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 items-center gap-4">

                        
                        {paid==="Paid" && (
                            <>
                                <p>Scan Agent: {username}</p>
                                <p>Actual Payment: {actualPayment}</p>
                                <p>Payment: {payment}</p>
                                <p>Total Working Days: {totalWorkingDays}</p>
                                <p>Leaves Taken: {leaves}</p>
                                <p>Status: {paid}</p>
                                <p>Date of Payment:{paidDate}</p>
                            </>
                            
                        )}
                        {paid!=="Paid" &&(
                            <>
                                <p>Scan Agent: {username}</p>
                                <p>Actual Payment: {actualPayment}</p>
                                <p>Payment: {calculateUpdatedPayment()}</p>
                                <p>Total Working Days: {totalWorkingDays}</p>
                                <p>Leaves Taken: {leaves}</p>
                                <p>Status: {paid}</p>
                                <div className="grid grid-cols-3 items-center gap-4">
                        <span className=" font-bold text-center col-span-3">
                          Process payment

                        </span>
                          Payment: {calculateUpdatedPayment()}

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
                                                            autoFocus
                                                            className="border border-gray-300 rounded-md p-1 col-span-2"
                                                            value={bonus}
                                                            onChange={(e)=> handleBonusChange(e.target.value)}
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
                                                    className={"flex flex-col justify-center align-middle items-center"}
                                                >
                                                    <div className="flex flex-row align-middle items-center justify-center">
                                                    <div className="flex flex-col m-3">
                                                        <div className="grid grid-cols-3">
                                                            <label>Detect Amt: </label>
                                                            <input
                                                                autoFocus
                                                                className="border border-gray-300 rounded-md p-1 col-span-2"
                                                                value={detect}
                                                                
                                                                onChange={(e)=>handleDetectChange(e.target.value)}
                                                            ></input>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <button onClick={removeDetect}>
                                                            <Minus className={"rounded-xl bg-blue-300"} />
                                                        </button>
                                                    </div>
                                                    </div>
                                                    <div className="flex flex-row justify-center items-center align-middle">
                                                    <div className="flex flex-col m-3">
                                                        <div className="grid grid-cols-3">
                                                            <label>Detect Wday: </label>
                                                            <input
                                                                autoFocus
                                                                className="border border-gray-300 rounded-md p-1 col-span-2"
                                                                value={detectday}
                                                                
                                                                onChange={(e)=>handleDetectDayChange(e.target.value)}
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
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        className="border border-gray-300 bg-sky-800 hover:bg-sky-600 text-white rounded-md px-2 py-2 w-30 "
                                        onClick={updateStatus}
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
