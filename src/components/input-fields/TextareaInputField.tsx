import React from 'react';

interface TextareaProps {
    title: string;
    instructions: string;
    onChange: (value: string) => void;
}

const TextareaInputField = (props: TextareaProps) => {
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.target.value;
        props.onChange(value);
    };

    return (<>
            <label className="block text-sm font-medium leading-6 text-gray-900">
                {props.title}
            </label>
            <div className="mt-2">
                <textarea
                    id=""
                    name=""
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main-500 sm:text-sm sm:leading-6"
                    defaultValue={''}
                    onChange={handleChange}
                />
            </div>
            <p className="mt-3 text-sm leading-6 text-gray-600">{props.instructions}</p>
        </>
    );
};

export default TextareaInputField;