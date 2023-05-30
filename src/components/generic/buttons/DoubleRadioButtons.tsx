import React from 'react';

interface Option {
    label: string;
    value: any;
}

interface DoubleRadioButtonsProps {
    label: string;
    options: Option[];
    onRadioChange: (value: Option) => void;
}

const DoubleRadioButtons = ({label, options, onRadioChange}: DoubleRadioButtonsProps) => {
    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const selectedOption = options.find(option => option.label == value);
        if (selectedOption) {
            onRadioChange(selectedOption);
        }
    };

    return (
        <fieldset>
            <legend className="mt-3 text-sm leading-6 text-gray-600">{label}
            </legend>

            <div className="mt-4 space-x-6 flex items-center">
                {options.map((option) => (
                    <div className="flex items-center gap-x-3" key={option.value}>
                        <input
                            id={`push-${option.label}`}
                            name="push-notifications"
                            type="radio"
                            className="h-4 w-4 border-gray-300 text-main-500 focus:ring-main-500"
                            value={option.label}
                            onChange={handleRadioChange}
                        />
                        <label
                            className="block text-sm font-medium leading-6 text-gray-900">
                            {option.label}
                        </label>
                    </div>
                ))}

            </div>
        </fieldset>
    );
};

export default DoubleRadioButtons;