import React from "react";
import ProtectedRoute from "@/components/generic/navigation/ProtectedRoute";
import {AiOutlineAppstoreAdd} from "react-icons/all";
import AnimatedIconButton from "@/components/generic/buttons/AnimatedIconButton";
import SearchInput from "@/components/generic/input/SearchInput";
import RoleBasedComponent from "@/components/generic/RoleBasedComponent";
import {getAllProjects} from "@/lib/ProjectService";
import {InferGetServerSidePropsType} from "next/types";
import {Project} from "@prisma/client";
import {useRouter} from "next/router";

export const getServerSideProps: any = async () => {
    try {
        const projects: Project[] = await getAllProjects();
        console.log(projects);
        return {
            props: {
                projects,
            },
        };
    } catch (e) {
        console.log(e);
    }
};

const Projects = ({projects}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter();

    return (
        <ProtectedRoute>
            <div className="px-12 pt-6">
                <div className="flex justify-between items-center">
                    <div className="flex w-1/2 items-center">
                        <h1 className="text-neutral-500 text-2xl font-semibold mr-6">Projects</h1>
                        <RoleBasedComponent adminComponent={<SearchInput/>}/>
                    </div>
                    <AnimatedIconButton text={"Add Project"} icon={<AiOutlineAppstoreAdd size={20}/>} isLink={true}
                                        href={"/projects/addProject"}></AnimatedIconButton>
                </div>
                <div className="mt-6">
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                            <thead>
                            <tr>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Name</th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Construction
                                    Title
                                </th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Construction Type
                                </th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Construction
                                    Impacts Environment
                                </th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Assessment Phase
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {projects.map((project: Project) => (
                                <tr className="hover:cursor-pointer hover:bg-gray-100" key={project.id}
                                    onClick={() => router.push(`/projects/${project.id}`)}>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">Proj-{project.id}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">{project.constructionTitle}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">{project.constructionType}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">{project.constructionImpactsEnvironment ? "Yes" : "No"}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">Phase 3: Final Phase</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default Projects;
