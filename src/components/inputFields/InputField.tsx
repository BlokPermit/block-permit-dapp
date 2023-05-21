import React from 'react';

interface InputFieldProps {
    id: string;
    label: string;
    placeholder: string;
    type: string;
}

const InputField = (props: InputFieldProps) => {
    return (
        <div>
            <label className="block text-xs font-medium text-gray-700">
                {props.label}
            </label>

            <input
                type={props.type}
                id={props.id}
                placeholder={props.placeholder}
                className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
            />
        </div>
    );
};

export default InputField;