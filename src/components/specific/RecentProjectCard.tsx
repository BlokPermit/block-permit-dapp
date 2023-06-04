import React from 'react';
import {Project} from "@prisma/client";
import Link from "next/link";
import {formatDate} from "@/utils/DateUtils";
import ProjectStateBadge from "@/components/specific/ProjectStateBadge";

interface RecentProjectProps {
    project: Project;
}

const RecentProjectCard = ({project}: RecentProjectProps) => {
    return (
        <Link key={project.id}
              className="border border-neutral-200 shadow rounded-md px-5 py-4 max-w-sm w-full mr-6 my-2 hover:bg-neutral-100"
              href={`/projects/${project.id}`}>

            <div className="flex-col">
                <div className="flex justify-between mb-3">
                    <div className="text-bold text-xl">{project.constructionTitle}</div>
                    <ProjectStateBadge state={project.projectState}/>
                </div>
                <div className="flex">
                    <div className="text-neutral-400 mr-2">Tip konstrukcije:</div>
                    {project.constructionType}</div>
                <div></div>
                <div className="flex">
                    <div className="text-neutral-400 mr-2">Vpliv na okolje:</div>
                    {(project.constructionImpactsEnvironment) ? "Da" : "Ne"}</div>
                <div></div>
                <div className="flex">
                    <div className="text-neutral-400 mr-2">Ustvarjen:</div>
                    {formatDate(project.createdAt)}</div>
            </div>

        </Link>
    );
};

export default RecentProjectCard;