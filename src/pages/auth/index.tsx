import React, {useContext} from 'react';
import {AuthContext} from "@/context/AuthContext";


const Auth = () => {
    const {account, connectWallet, error} = useContext(AuthContext);
    return (
        <div className="container">
            <div className="box">
                <h1 className="block text-xl">
                    MetaMask
                </h1>
                {account ? (
                    <span className="block mt-2">Connected.</span>
                ) : (
                    <span className="block mt-2">Please connect a wallet.</span>
                )}


                {account ? (
                    <div className="account-box mt-2">
                        Your address:  <p className="shadow-border text-orange-500 pt-1">{account}</p>
                    </div>
                ) : (
                    <button
                        className="inline-block rounded-lg px-4 py-2 text-sm font-medium text-white-500 hover:text-orange-500 bg-orange-500 hover:bg-gray-50 focus:relative mt-4" onClick={connectWallet}
                    >
                        Connect Wallet
                    </button>
                )}
                {error && <p className={`error shadow-border`}>{`Error: ${error}`}</p>}
            </div>
        </div>
    );
};

export default Auth;