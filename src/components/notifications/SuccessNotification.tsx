import React, {useEffect, useState} from 'react';

interface ErrorNotificationProps {
    title: string;
    message?: string
}

const ErrorNotification = ({title, message}: ErrorNotificationProps) => {
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
        <div role="alert" className="rounded border-s-4 border-green-500 bg-green-50 p-4 fixed bottom-10 right-14 ">
            <strong className="block font-medium text-green-800"> {title}</strong>

            <p className="mt-2 text-sm text-green-700">
                {message}
            </p>
        </div>

    );
};

export default ErrorNotification;