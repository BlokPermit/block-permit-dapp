import React, {useState} from "react";

interface InputFieldProps {
    id: string;
    label: string;
    placeholder: string;
    type: string;
    value?: any;
    onChange: (value: string) => void;
    name?: string;
}

const UserInputField = (props: InputFieldProps) => {
    const [, setProjectName] = useState<string>(props.value || "");
    const handleChange = (event: any) => {
        const value = event.target.value;
        setProjectName(value)
        props.onChange(value);
    };


    return (
        <div>
            <label className="block text-xs font-medium text-gray-700 pl-3">{props.label}</label>

            <input type={props.type} id={props.id} placeholder={props.placeholder} name={props.name}
                   className="mt-1 w-full rounded-lg border border-gray-200 shadow-sm sm:text-sm h-12 p-3"
                   value={props.value} onChange={handleChange}/>
        </div>
    );
};

export default UserInputField;
