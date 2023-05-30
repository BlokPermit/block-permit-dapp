import React, {useState} from 'react';
import {AiFillFile, AiFillFileAdd} from "react-icons/all";

interface DocumentInputProps {
    label: string;
    title: string;
    description: string;
    onDocumentChange: (file: File | null) => void;
}

const DocumentInput = ({label, title, description, onDocumentChange}: DocumentInputProps) => {
    const [fileName, setFileName] = useState<string | undefined>(undefined);
    const handleDocumentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file != null) {
            setFileName(file?.name);
            onDocumentChange(file);
        }
    };

    return (
        <div>

            <h2 className="text-xl font-semibold leading-7 text-gray-900">{title}</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
                {description}
            </p>

            <div className="mt-10 space-y-10">
                <div className="col-span-full">
                    <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                        {label}
                    </label>
                    <div
                        className={`mt-2 flex justify-center rounded-lg ${fileName != undefined ? 'bg-gradient-to-l from-main-100 to-main-400 border-none' : ''} border border-dashed border-gray-900/25 px-6 py-10`}>
                        <div className="text-center ">
                            {fileName == undefined ?
                                <AiFillFileAdd className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true"/> :
                                <AiFillFile className="mx-auto h-12 w-12 text-white"></AiFillFile>}
                            <div
                                className="mt-4 flex items-center justify-center text-sm leading-6  text-gray-600">
                                <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer rounded-md  font-semibold text-main-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-main-200 focus-within:ring-offset-2 hover:text-main-500"
                                >
                                    {fileName == undefined ? <span>Upload a file</span> :
                                        <span
                                            className="text-white mr-2">{fileName}</span>
                                    }
                                    <input
                                        id="file-upload"
                                        name="file-upload"
                                        type="file"
                                        className="sr-only"
                                        onChange={handleDocumentChange}
                                    />
                                </label>
                                {fileName != undefined ? <span id="file-upload-text"
                                                               className={`ml-2 text-white`}></span> : null}
                            </div>
                            <p className={`text-xs leading-5 ${fileName != undefined ? 'text-white' : ''}`}>PDF,
                                DOCX, PNG up to 10MB</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentInput;