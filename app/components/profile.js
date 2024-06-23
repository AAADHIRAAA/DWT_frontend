import React, {useState,useEffect} from "react";
import "react-datepicker/dist/react-datepicker.css";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from "@/app/components/ui/dialog"
import Image from "next/image";

const DialogBoxforprofile = ({
                        action,
                       userId,
                   }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [emergency, setEmergency]=useState("");
    const [phone, setPhone] = useState("");
    const [issues, setIssues] = useState("");
    const [blood,setBlood] = useState("");
    const [current,setCurrent]=useState("");
    const [permanent, setPermanent]=useState("");
 
    const getProfile = async () => {
        try {
            console.log("call");
            const response = await fetch(
              `https://trackserv.techfiz.com/api/v1/users/getprofile/${userId}`
            );
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const responseData = await response.json();
            console.log(responseData);
         
           // Check if userProfile exists in responseData
           if (responseData.userProfile) {
              const userProfileData = responseData.userProfile;
        
            setName(userProfileData.userName);
            setAge(parseInt(userProfileData.age,10));
            setGender(userProfileData.gender);
            setPhone(parseInt(userProfileData.phone,10));
            setEmergency(parseInt(userProfileData.emergency,10));
            setBlood(userProfileData.bloodGroup);
            setIssues(userProfileData.issues);
            setCurrent(userProfileData.currentAddress);
            setPermanent(userProfileData.permanentAddress);
           
          }
          } catch (error) {
            console.error("Error fetching data:", error.message);
          }
       
    };

    useEffect(()=>{
        getProfile();
    },[isOpen])


    return (
        <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
            <DialogTrigger className="text-sky-600">
                <button ><Image src={"/view.jpg"} width={40} height={50}/></button>

            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>User Profile</DialogTitle>
                    <div className="flex flex-col gap-5 text-sky-800 mt-25">
               
                    <p>Name: {name}</p>
                    <p>Age: {age}</p>
                    <p>Gender: {gender}</p>
                    <p>BloodGroup: {blood}</p>
                    <p>Phone no.: {phone}</p>
                    <p>Emergency no.: {emergency}</p>
                    <p>Current Address: {current}</p>
                    <p>Permanent Address: {permanent}</p>
                    <p>Health Issues: {issues}</p>
                    </div>
                   
                </DialogHeader>


            </DialogContent>
        </Dialog>)

};

export default DialogBoxforprofile;
