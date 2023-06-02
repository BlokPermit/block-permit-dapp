import React, {useEffect} from "react";
import ProtectedRoute from "@/components/generic/navigation/ProtectedRoute";
import { AiOutlineAppstoreAdd } from "react-icons/all";
import AnimatedIconButton from "@/components/generic/buttons/AnimatedIconButton";
import SearchInput from "@/components/generic/input/SearchInput";
import ProjectPlaceholder from "@/components/generic/placeholders/ProjectPlaceholder";
import RoleBasedComponent from "@/components/generic/RoleBasedComponent";
import {provider} from "../../utils/EthereumClient";

const Projects = () => {
  return (
    <ProtectedRoute>
      <div className="px-12 pt-6">
        <div className="flex justify-between items-center">
          <div className="flex w-1/2 items-center">
            <h1 className="text-neutral-500 text-2xl font-semibold mr-6">Projects</h1>
            <RoleBasedComponent adminComponent={<SearchInput />} />
          </div>
          <AnimatedIconButton text={"Add Project"} icon={<AiOutlineAppstoreAdd size={20} />} isLink={true} href={"/projects/addProject"}></AnimatedIconButton>
        </div>
        <div className="mt-8">
          <div className="flex flex-wrap mt-3">
            {Array.from({ length: 5 }).map((value, index: number) => (
              <ProjectPlaceholder key={index} myKey={index} />
            ))}
          </div>
        </div>
        <div className="mt-8">
          <div className="flex items-center">
            <h1 className="text-neutral-500 text-2xl font-semibold mr-3">Awaiting approval</h1>
            <span className="inline-flex items-center justify-center rounded-full bg-amber-100 px-3 py-1  text-amber-700  h-1/4 mt-0.5">
              <p className="whitespace-nowrap text-sm">1 new project</p>
            </span>
          </div>
          <div className="flex flex-wrap mt-3">
            {Array.from({ length: 3 }).map((value, index) => (
              <ProjectPlaceholder key={index} myKey={index} />
            ))}
          </div>
          <div className="mt-10">
            <div className="flex items-center">
              <h1 className="text-neutral-500 text-2xl font-semibold mr-3">Finished</h1>
              <span className="inline-flex items-center justify-center rounded-full bg-green-200 px-3 py-1 text-green-700  h-1/4 mt-0.5">
                <p className="whitespace-nowrap text-sm">10 projects</p>
              </span>
            </div>
            <div className="flex flex-wrap mt-3">
              {Array.from({ length: 10 }).map((value, index: number) => (
                <ProjectPlaceholder key={index} myKey={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Projects;
