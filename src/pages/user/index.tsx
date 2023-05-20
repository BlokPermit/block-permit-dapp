import React from 'react';
import Jazzicon from "react-jazzicon";
import {useUser} from "@/context/UserContext";


const Documents = () => {
    const {accountAddress} = useUser();
    return (
        <div>

        <div className="flex mb-8">
            <Jazzicon
                seed={10015}
                diameter={80}
            />
            <div className="pl-5 flex flex-col mt-auto mb-auto ">
            <h1 className="text-black text-2xl font-semibold">Test User</h1>
                <span className="text-neutral-500 pl-1">{accountAddress}</span>
            </div>
        </div>
            <span className="text-neutral-500 text-xl">User info..</span>
        </div>
    );
};

export default Documents;