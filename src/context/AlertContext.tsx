import {createContext, useState} from 'react';

const ALERT_TIME = 5000;

export interface AlertProps {
    title: string;
    message: string;
    type: 'success' | 'error' | '' | string;
}

const initialState: AlertProps = {
    title: '',
    message: '',
    type: '',
};

const AlertContext = createContext({
    ...initialState,
    setAlert: ({title, message, type}: AlertProps) => {
    },
});

export const AlertProvider = ({children}: any) => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState('');

    const setAlert = ({title, message, type}: AlertProps) => {
        setTitle(title);
        setMessage(message);
        setType(type);

        setTimeout(() => {
            setTitle('');
            setMessage('');
            setType('');
        }, ALERT_TIME);
    };

    return (
        <AlertContext.Provider
            value={{
                title,
                message,
                type,
                setAlert,
            }}
        >
            {children}
        </AlertContext.Provider>
    );
};

export default AlertContext;