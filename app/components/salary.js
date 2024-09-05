import React, {useState,useEffect} from "react";
import "react-datepicker/dist/react-datepicker.css";
import {Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogTrigger,} from "@/app/components/ui/dialog"
import Image from "next/image";

const DialogBox = ({
                       action,
                       userId,
                       username,
                       handleButtonClick
                   }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [salary, setSalary] = useState(0);

    const handleSalaryChange=(e)=>{
        if (!isNaN(Number(e))) {
            setSalary(Number(e));
           
        }
    }

    const handleSubmit = async () => {

  
        try {
            const data = {
                userId:userId,
                username:username,
                actualPay:salary,
            };
            console.log(data)
            const response = await fetch(
                "https://trackserv.techfiz.com/api/v1/admin/actualPay",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ data }),
                }
            );
            console.log(response);
            
            console.log('clicked');
            setIsOpen(false); 
            handleButtonClick();
            console.log("Data saved successfully!");
            
        } catch (error) {
            console.error("Error saving data:", error.message);
        }
    };


   

    return (
        <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
            <DialogTrigger className="text-sky-600">
                <button ><Image src={"/edit.jpg"} width={40} height={50}/></button>

            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle> Edit Actual Salary</DialogTitle>

                </DialogHeader>
                <div className="text-sky-800">
                    <p>ScanAgent Name: {username}</p>
                    <div className="grid grid-cols gap-4">
                                                        <label>Enter Actual Salary: </label>
                                                        <input
                                                            autoFocus
                                                            className="border border-gray-300 rounded-md p-1 col-span-2"
                                                            value={salary}
                                                            onChange={(e)=> handleSalaryChange(e.target.value)}
                                                        ></input>
                                                    </div>
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
