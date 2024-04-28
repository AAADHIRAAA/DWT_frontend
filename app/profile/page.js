"use client"
import Header from "../components/Header";
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Form,
    FormControl, FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/app/components/ui/form';
import {Input} from '@/app/components/ui/input';
import {Button} from '@/app/components/ui/button';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/app/components/ui/select';

import {Textarea} from '@/app/components/ui/textarea';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/app/components/ui/card";
import axios from "axios";
import {useUser} from "@clerk/nextjs";
import {useEffect} from "react";

const formSchema = z.object({

    name: z.string().min(1, {
        message: 'Name is required',
    }),
    age: z.number().min(1, "Age is Required"),
    gender: z.string().min(1, "Required"),
    bloodGroup: z.string().min(1, "BloodGroup is Required"),
    emergencyContact: z.number().refine(data =>{
        const strData = String(data); // Convert to string
        return strData.length === 10 ;
    }, {
        message: "Number must be 10 digits",
    }),
    phone: z.number().refine(data => {
        const strData = String(data); // Convert to string
        return strData.length === 10 ;
    },{
        message: "Number must be 10 digits",
    }),
    permanentAddress:z.string().min(1, "Permanent Address is Required"),
    currentAddress:z.string().min(1, "CurrentAddress is Required"),
    healthIssues: z.string().min(1, "Health issues is Required"),
});

 const UserDashboard = () => {
    
    const {user} = useUser();
    const form = useForm({
        resolver: zodResolver(formSchema),
        mode: 'onChange', // Enable onChange mode for live form validation
    });
    const isLoading = form.formState.isSubmitting;

    const fetchData = async () => {
        try {
          
          const response = await fetch(
            `https://digitized-work-tracker-backend.vercel.app/api/v1/users/getprofile/${user.id}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const responseData = await response.json();
      
       
         // Check if userProfile exists in responseData
         if (responseData.userProfile) {
            const userProfileData = responseData.userProfile;
            // Set default values for form fields

            form.setValue("name", userProfileData.userName);
            form.setValue("age", userProfileData.age);
            form.setValue("gender", userProfileData.gender);
            form.setValue("bloodGroup", userProfileData.bloodGroup);
            form.setValue("emergencyContact", userProfileData.emergency);
            form.setValue("phone", userProfileData.phone);
            form.setValue("healthIssues", userProfileData.issues);
            form.setValue("permanentAddress",userProfileData.permanentAddress);
            form.setValue("currentAddress",userProfileData.currentAddress);
        }
        } catch (error) {
          console.error("Error fetching data:", error.message);
        }
      };
      
      useEffect(()=>{

        if(user){
            fetchData();
        }
    },[user]);

 

    const onSubmit = async (values) => {
        try {
          
            console.log(values);
            await axios.post("https://digitized-work-tracker-backend.vercel.app/api/v1/users/profile", {
                userId: user.id,
                ...values, // Send all form values to the backend API
            
            });
            
        } catch (error) {
            console.error(error)
        }
    };

   

    return(
        <>
     <Header/>
    <Card className="w-fit  mx-auto mt-20 text-white bg-sky-900">
    <CardHeader>
        <CardTitle className='mx-auto'>{user && user.firstName}'s Profile</CardTitle>
       
    </CardHeader>
    <CardContent className='mt-20 text-lg'>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid w-full items-center gap-4 grid-cols-3">
                    <FormField
                        disabled={isLoading}
                        name={"name"}
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Name:</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        placeholder="Enter your Name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )
                        }/>
                    <FormField
                        disabled={isLoading}
                        name={"age"}
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Age:</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        placeholder="Enter your Age"
                                        type={"number"}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )
                        }/>
                    <FormField
                        disabled={isLoading}
                        name={"gender"}
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Gender:</FormLabel>
                                <Select
                                    disabled={isLoading}
                                    onValueChange={field.onChange}
                                   
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a Gender"/>
                                        </SelectTrigger>
                                    </FormControl>

                                    <SelectContent>
                                        <SelectGroup className=" bg-white">
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )
                        }/>
                    <FormField
                        disabled={isLoading}
                        name={"bloodGroup"}
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Blood Group:</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your bloodgroup" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )
                        }/>
                    <FormField
                        disabled={isLoading}
                        name={"emergencyContact"}
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Emergency contact: </FormLabel>
                                <FormControl>
                                    <Input
                                        type={"number"}
                                        disabled={isLoading}
                                        placeholder="Enter emergency number"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )
                        }/>
                    <FormField
                        disabled={isLoading}
                        name={"phone"}
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Phone Number:</FormLabel>
                                <FormControl>
                                    <Input
                                        type={"number"}
                                        disabled={isLoading}
                                        placeholder="Enter your Phone Number"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )
                        }/>
                
                <FormField
                    disabled={isLoading}
                    name={"permanentAddress"}
                    control={form.control}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Permanent Address </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter your permanent address"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )
                    }/>
                    <FormField
                    disabled={isLoading}
                    name={"currentAddress"}
                    control={form.control}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Current Address </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter your current address"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )
                    }/>
                    <FormField
                    disabled={isLoading}
                    name={"healthIssues"}
                    control={form.control}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Health Issues </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Health Issues"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )
                    }/>
                </div>
                <div className="flex flex-col space-y-1.5 pt-2">
                    <Button type="submit">Submit</Button>
                </div>
            </form>
        </Form>
    </CardContent>

</Card>

</>
);
}

export default UserDashboard;