import React, {useState} from 'react';

interface ConstructionTitleFieldProps {
    label: string;
    onChange: (value: string) => void;
    initialValue?: string;
}

const CreateProjectInputField = ({label, onChange, initialValue = ""}: ConstructionTitleFieldProps) => {
    const [constructionTitle, setConstructionTitle] = useState<string>(initialValue);

    const handleChange = (event: any) => {
        const value = event.target.value;
        setConstructionTitle(value)
        onChange(value);
    };

    return (
        <div>
            <label className="block text-sm font-medium leading-6  text-gray-900">
                {label}
            </label>
            <div className="mt-2">
                <div
                    className="flex rounded-md  sm:max-w-md">
                    <input
                        value={constructionTitle}
                        type="text"
                        className="block flex-1 shadow-sm rounded-md border-0.5 border-gray-300 bg-white py-1.5 pl-2 text-gray-900 placeholder:text-gray-400  focus-within:ring-main-500 sm:text-sm sm:leading-6"
                        placeholder="Enter construction title..."
                        onChange={handleChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default CreateProjectInputField;