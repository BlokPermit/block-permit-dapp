import React, {useState} from 'react';
import InputField from "@/components/input-fields/InputField";
import AnimatedIconButton from "@/components/buttons/AnimatedIconButton";
import {AiFillAndroid, AiOutlineSend} from "react-icons/all";
import ErrorNotification from "@/components/notifications/ErrorNotification";
import SuccessNotification from "@/components/notifications/SuccessNotification";
import {BreadCrumbs} from "@/components/breadcrumbs/Breadcrumbs";

const AddProject = () => {
    const [isError, setIsError] = useState(null);
    const handleSubmit = async (event: any) => {
        event.preventDefault();

        const data = {
            first: event.target.first.value,
            last: event.target.last.value,
        };

        const endpoint = '/api/forms/addProject';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Error occurred');
            }

            const result = await response.json();
            // @ts-ignore
            setIsError(false);
        } catch (error: any) {
            // @ts-ignore
            setIsError(true);
            // Handle the error appropriately
        }
    };

    return (
        <div>
            <BreadCrumbs/>
            <div className="">
                <h1 className="text-neutral-500 text-2xl font-semibold">Recent projects</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="flex py-12 h-screen">
                    <div className="w-1/2 px-32 flex-col gap-5 m-0">
                        <InputField id={"name"} label={"Project name"} type={"text"}
                                    placeholder={"Name your project..."}/>
                        <InputField id={""} label={"Description"} type={"text"}
                                    placeholder={"Describe project in a few words..."}/>

                    </div>
                    <div className="w-1/2 px-12">

                        <InputField id={"first"} label={"First"} type={"text"} placeholder={"First"}/>
                        <InputField id={"last"} label={"Last"} type={"text"} placeholder={"Last"}/>
                        <AnimatedIconButton text={"Create"} icon={<AiFillAndroid/>} onClick={() => {
                        }} type={"submit"}></AnimatedIconButton>

                    </div>
                </div>
                {isError === true && (<ErrorNotification error={"test"}/>)}
                {isError === false && (<SuccessNotification title={"Success"} message={"Created project."}/>)}
            </form>
        </div>
    );
};

export default AddProject;