import React, {createContext, FC, ReactNode, useContext, useEffect, useState} from 'react';

interface LayoutProps {
    children: ReactNode;
}

type UserContextType = {
    accountAddress: string | null;
    setAccountAddress: (address: string | null) => void;
}

const UserContext = createContext<UserContextType>({
    accountAddress: null,
    setAccountAddress: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider: FC<LayoutProps> = ({ children }) => {
    const [accountAddress, setAccountAddressState] = useState<string | null>(null);

    useEffect(() => {
        const storedAddress = localStorage.getItem('accountAddress');
        if (storedAddress) {
            setAccountAddressState(storedAddress);
        }
    }, []);

    const setAccountAddress = (address: string | null) => {
        setAccountAddressState(address);
        if (address) {
            localStorage.setItem('accountAddress', address);
        } else {
            localStorage.removeItem('accountAddress');
        }
    };

    const authContextValue: UserContextType = {
        accountAddress,
        setAccountAddress,
    };

    return (
        <UserContext.Provider value={authContextValue}>
            {children}
        </UserContext.Provider>
    );
};

