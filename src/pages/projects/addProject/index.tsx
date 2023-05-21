import React, {useState} from 'react';
import InputField from "@/components/inputFields/InputField";
import AnimatedIconButton from "@/components/buttons/AnimatedIconButton";
import {AiOutlineSend} from "react-icons/all";
import ErrorNotification from "@/components/notifications/ErrorNotification";
import SuccessNotification from "@/components/notifications/SuccessNotification";

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
            console.error('Error:', error.message);
            // @ts-ignore
            setIsError(true);
            // Handle the error appropriately
        }
    };

    return (
        <div className="">
            <form onSubmit={handleSubmit}>
                <InputField id={"first"} label={"First"} type={"text"} placeholder={"First"}/>
                <InputField id={"last"} label={"Last"} type={"text"} placeholder={"Last"}/>
                <AnimatedIconButton type="submit" text={"Submit"} icon={<AiOutlineSend/>} href="/projects/addProject"></AnimatedIconButton>
                {isError === true && (<ErrorNotification error={"test"}/>)}
                {isError === false && (<SuccessNotification title={"Success"} message={"Created project."}/>)}
            </form>
        </div>
    );
};

export default AddProject;