import React, {useEffect, useState} from "react";
import ProtectedRoute from "@/components/generic/navigation/ProtectedRoute";
import {Project} from "@prisma/client";
import {findProjectById, getRecentProjectsByState} from "@/lib/ProjectService";
import {InferGetServerSidePropsType} from "next/types";
import RecentProjectCard from "@/components/specific/RecentProjectCard";
import {ProjectState} from ".prisma/client";
import ProjectAddPlaceholder from "@/components/specific/ProjectAddPlaceholder";
import {getRecentProjects} from "@/utils/LocalStorageUtil";
import {getSession} from "next-auth/react";

export const getServerSideProps: any = async (context: any) => {
    try {
        const session = await getSession(context);

        if (!session) {
            return {
                redirect: {
                    destination: "/auth",
                    permanent: false,
                },
            };
        } else {
            const loggedInUser = session.user;
            const acquiringConditionsProjects = await getRecentProjectsByState(ProjectState.AQUIRING_PROJECT_CONDITIONS, session.user?.id?.toString() || "");
            const acquiringOpinionsProjects = await getRecentProjectsByState(ProjectState.AQUIRING_PROJECT_OPINIONS, session.user?.id?.toString() || "");
            const acquiringBuildingPermitsProjects = await getRecentProjectsByState(ProjectState.AQUIRING_BUILDING_PERMIT, session.user?.id?.toString() || "");

            return {
                props: {
                    acquiringConditionsProjects,
                    acquiringBuildingPermitsProjects,
                    acquiringOpinionsProjects,
                    loggedInUser
                },
            };
        }
    } catch (error: any) {
        console.error(error.message);
    }
};

const Dashboard = ({
                       acquiringConditionsProjects = [],
                       acquiringBuildingPermitsProjects = [],
                       acquiringOpinionsProjects = [],
                        loggedInUser
                   }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [recentProjects, setRecentProjects] = useState([]);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        const recentProjects = await getRecentProjects(loggedInUser.id.toString());
        setRecentProjects(recentProjects);
    };

    return (
        <ProtectedRoute>
            <div className="px-12 pt-6">
                <div className="mt-2">
                    <h1 className="text-neutral-500 text-2xl font-semibold">Nedavni projekti</h1>
                    <div className="flex flex-wrap mt-3">
                        {(recentProjects.length != 0) ? recentProjects.map((recentProject: Project) =>
                            <RecentProjectCard project={recentProject}/>) : <ProjectAddPlaceholder/>}
                    </div>
                </div>
                <div className="mt-10">
                    <div className="flex items-center">
                        <h1 className="text-neutral-500 text-2xl font-semibold mr-3"><span
                            className="text-neutral-400">Faza 1:</span> Pridobivanje projektnih
                            pogojev</h1>
                        <span
                            className="inline-flex items-center justify-center rounded-full bg-amber-100 px-2.5 py-0.5 text-amber-700  h-1/4 mt-0.5">
              <p className="whitespace-nowrap text-sm">1 nov projekt</p>
            </span>
                    </div>
                    <div className="flex flex-wrap mt-3">
                        {(acquiringConditionsProjects.length != 0) ? acquiringConditionsProjects.map((recentProject: Project) =>
                            <RecentProjectCard
                                project={recentProject}/>) : <ProjectAddPlaceholder/>}
                    </div>
                </div>
                <div className="mt-10">
                    <h1 className="text-neutral-500 text-2xl font-semibold mt-10"><span
                        className="text-neutral-400">Faza 2:</span> Pridobivanje projektnih
                        mnenj</h1>
                    <div className="flex flex-wrap mt-3">
                        {(acquiringOpinionsProjects.length != 0) ? acquiringOpinionsProjects.map((recentProject: Project) =>
                            <RecentProjectCard
                                project={recentProject}/>) : <ProjectAddPlaceholder/>}
                    </div>
                </div>
                <div className="mt-10">
                    <h1 className="text-neutral-500 text-2xl font-semibold mt-10"><span
                        className="text-neutral-400">Faza 3:</span> Izdaja
                        gradbenih
                        dovoljenj</h1>
                    <div className="flex flex-wrap mt-3">
                        {(acquiringOpinionsProjects.length != 0) ? acquiringBuildingPermitsProjects.map((recentProject: Project) =>
                            <RecentProjectCard
                                project={recentProject}/>) : <ProjectAddPlaceholder/>}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default Dashboard;
