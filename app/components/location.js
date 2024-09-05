import React, {useState,useEffect} from "react";
import "react-datepicker/dist/react-datepicker.css";
import {Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogTrigger,} from "@/app/components/ui/dialog"
import Image from "next/image";

const DialogBoxForLocation = ({
                       action,
                       userId,
                       username,
                       handleButtonClick
                   }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [location, setLocation] = useState("");

    const handleLocationChange=(e)=>{
        setLocation(e);
    }

    const handleSubmit = async () => {

  
        try {
            const data = {
                userId:userId,
                username:username,
                location:location,
            };
            console.log(data)
            const response = await fetch(
                "https://trackserv.techfiz.com/api/v1/admin/location",
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
            setIsOpen(!isOpen);
            console.log("Data saved successfully!");
        } catch (error) {
            console.error("Error saving data:", error.message);
        }
    };


   

    return (
        <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
            <DialogTrigger className="text-sky-600">
                <button ><Image src={"/assign.jpg"} width={40} height={50}/></button>

            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle> Change Location</DialogTitle>

                </DialogHeader>
                <div className="text-sky-800">
                    <p>ScanAgent Name: {username}</p>
                    <div className="grid grid-cols gap-4">
                                                        <label>Assign Location: </label>
                                                        <select
                                                            className="border border-gray-300 rounded-md p-1 col-span-2"
                                                            value={location}
                                                            onChange={(e) => handleLocationChange(e.target.value)}
                                                            >
                                                            <option value="" hidden>Select location</option>
                                                            <option value="Gandhi Bhavan">Gandhi Bhavan</option>
                                                            <option value="Lalbagh Botanical Garden">Lalbagh Botanical Garden</option>
                                                        </select>
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

export default DialogBoxForLocation;
