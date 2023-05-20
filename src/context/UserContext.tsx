import React, {createContext, FC, ReactNode, useContext, useState} from 'react';

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
    const [accountAddress, setAccountAddress] = useState<string | null>(null);

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