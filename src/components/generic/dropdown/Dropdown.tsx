import React, {useState} from 'react';

interface Option {
    value: any;
    label: string;
}

interface DropdownProps {
    label: string;
    options: Option[],
    onChange: (value: Option) => void;
}

function Dropdown({label, options, onChange}: DropdownProps) {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        const selectedOption = options.find((option) => option.value === selectedValue);
        if (selectedOption) {
            onChange(selectedOption);
        }
    };

    return (<>
            <label
                className="block text-sm font-medium leading-6 text-gray-900">
                {label}
            </label>
            <div className="mt-2">
                <select
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-main-500 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </>

    );
}

export default Dropdown;