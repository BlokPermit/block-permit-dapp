import React from 'react';
import InputField from "@/components/inputFields/InputField";
import AnimatedIconButton from "@/components/buttons/AnimatedIconButton";
import {AiOutlineSend} from "react-icons/all";

const AddProject = () => {
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
            alert(`Is this your full name: ${result.data}`);
        } catch (error: any) {
            console.error('Error:', error.message);
            // Handle the error appropriately
        }
    };

    return (
        <div className="">
            <form onSubmit={handleSubmit}>
                <InputField id={"first"} label={"First"} type={"text"} placeholder={"First"}/>
                <InputField id={"last"} label={"Last"} type={"text"} placeholder={"Last"}/>
                <AnimatedIconButton type="submit" text={"Submit"} icon={<AiOutlineSend/>} href="/projects/addProject"></AnimatedIconButton>
            </form>
        </div>
    );
};

export default AddProject;