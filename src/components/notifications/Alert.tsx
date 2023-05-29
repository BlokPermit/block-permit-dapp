import React from 'react';
import useAlert from "@/hooks/AlertHook";


const Alert = () => {
    const {title, message, type} = useAlert();

    if (type == 'success') {
        return (
            <div role="alert"
                 className="rounded border-s-4 border-green-500 bg-green-50 p-4 fixed bottom-10 right-14 animate-[fade-in-right_1s_ease-in-out]">
                <strong className="block font-medium text-green-800"> {title}</strong>

                <p className="mt-2 text-sm text-green-700">
                    {message}
                </p>
            </div>

        );
    } else if (type == 'error') {
        return <div role="alert"
                    className="rounded border-s-4 border-red-500 bg-red-50 p-4 fixed bottom-10 right-14 animate-[fade-in-right_1s_ease-in-out]">
            <strong className="block font-medium text-red-800"> Something went wrong </strong>

            <p className="mt-2 text-sm text-red-700">
                {message}
            </p>
        </div>;
    }
};

export default Alert;