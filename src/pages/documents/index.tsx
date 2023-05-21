import React from 'react';
import ProtectedRoute from "@/components/protectedRoute/ProtectedRoute";
import SearchInput from "@/components/search/SearchInput";
import AnimatedIconButton from "@/components/buttons/AnimatedIconButton";
import {AiFillFileAdd} from "react-icons/all";

const Documents = () => {
    return (<ProtectedRoute>
            <div className="px-12 pt-6 flex justify-between items-center">
                <div className="flex w-1/2 items-center">
                    <h1 className="text-neutral-500 text-2xl font-semibold mr-6">Documents</h1>
                    <SearchInput/>
                </div>
                <AnimatedIconButton text={"Upload Document"} icon={<AiFillFileAdd/>} isLink={true} href={"/projects/addProject"}></AnimatedIconButton>
            </div>
        </ProtectedRoute>
    );
};

export default Documents;