import React from 'react';
import ProtectedRoute from "@/components/protectedRoute/ProtectedRoute";
import {AiOutlineAppstoreAdd} from "react-icons/all";
import AnimatedIconButton from "@/components/buttons/AnimatedIconButton";

const Projects = () => {
    return (<ProtectedRoute>
            <div className="px-12 pt-6 flex justify-between ">
                <h1 className="text-neutral-500 text-2xl font-semibold">Projects</h1>
                <AnimatedIconButton text={"Add Project"} icon={<AiOutlineAppstoreAdd/>} isLink={true} href={"/projects/addProject"}></AnimatedIconButton>
            </div>
        </ProtectedRoute>
    );
};

export default Projects;