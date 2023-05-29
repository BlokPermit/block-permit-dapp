import React from 'react';

interface CreateProjectInputFieldProps {
    label: string;
    onChange: (value: string) => void;
}

const CreateProjectInputField = ({label, onChange}: CreateProjectInputFieldProps) => {
    const handleChange = (event: any) => {
        const value = event.target.value;
        onChange(value);
    };

    return (
        <div>
            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                {label}
            </label>
            <div className="mt-2">
                <div
                    className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-main-500 sm:max-w-md">
                    <input
                        type="text"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Name your project..."
                        onChange={handleChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default CreateProjectInputField;