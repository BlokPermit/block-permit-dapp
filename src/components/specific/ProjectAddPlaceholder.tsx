import React from 'react';
import Link from "next/link";
import {AiOutlinePlus, AiOutlinePlusCircle, HiPlus} from "react-icons/all";

function ProjectAddPlaceholder() {
    return (
        <Link
            className="border border-neutral-200 shadow rounded-md px-5 py-4 max-w-sm w-full mr-6 my-2 hover:bg-neutral-100"
            href={`/projects/addProject`}>
            <div className="animate-pulse flex items-center justify-center space-x-4 py-10">
                <HiPlus size={30} color="grey"/>
            </div>
        </Link>
    );
}

export default ProjectAddPlaceholder;