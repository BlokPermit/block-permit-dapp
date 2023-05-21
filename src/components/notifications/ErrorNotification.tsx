import React, {useEffect, useState} from 'react';

interface ErrorNotificationProps {
    error: string;
}

const ErrorNotification = ({error}: ErrorNotificationProps) => {
    const [show, setShow] = useState(true)

    useEffect(() => {
        const timeId = setTimeout(() => {
            setShow(false)
        }, 3000)

        return () => clearTimeout(timeId)
    }, []);

    if (!show) {
        return null;
    }

    return (
        <div role="alert" className="rounded border-s-4 border-red-500 bg-red-50 p-4 fixed bottom-10 right-14 ">
            <strong className="block font-medium text-red-800"> Something went wrong </strong>

            <p className="mt-2 text-sm text-red-700">
                {error}
            </p>
        </div>

    );
};

export default ErrorNotification;