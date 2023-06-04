import React from "react";
import ProtectedRoute from "@/components/generic/navigation/ProtectedRoute";
import { AiOutlineAppstoreAdd } from "react-icons/all";
import AnimatedIconButton from "@/components/generic/buttons/AnimatedIconButton";
import SearchInput from "@/components/generic/input/SearchInput";
import RoleBasedComponent from "@/components/generic/RoleBasedComponent";
import { getAllProjects } from "@/lib/ProjectService";
import { InferGetServerSidePropsType } from "next/types";
import { Project } from "@prisma/client";
import { useRouter } from "next/router";
import ProgressBar from "@/components/specific/ProgressBar";
import { ProjectModel, ProjectPhase } from "@/models/ProjectModel";

export const getServerSideProps: any = async () => {
  try {
    const baseProjects: Project[] = await getAllProjects();
    const projects: ProjectModel[] = baseProjects.map((project: Project) => {
      return {
        baseProject: project,
        projectPhase: ProjectPhase.PHASE_1,
        assessmentProviders: [],
      };
    });
    return {
      props: {
        projects: projects,
      },
    };
  } catch (e) {
    console.log(e);
  }
};

const Projects = ({ projects }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [selectedPhase, setSelectedPhase] = React.useState<number>(1);

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
        <div className="mt-6">
          <div className="my-3">
            <ProgressBar actualPhase={ProjectPhase.PHASE_3} selectedPhase={selectedPhase} handlePhaseChange={(phase: ProjectPhase) => setSelectedPhase(phase)} />
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm text-left">
              <thead>
                <tr>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Name</th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Construction Title</th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Constuction Type</th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Construction Impacts Envitonment</th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Assessment Phase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {projects.map(
                  (project: ProjectModel) =>
                    project.projectPhase == selectedPhase && (
                      <tr className="hover:cursor-pointer hover:bg-gray-100" key={project.baseProject.id} onClick={() => router.push(`/projects/${project.baseProject.id}`)}>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-900">Proj-{project.baseProject.id}</td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-900">{project.baseProject.constructionTitle}</td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-900">{project.baseProject.constructionType}</td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-900">{project.baseProject.constructionImpactsEnvironment ? "Yes" : "No"}</td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-900">{project.projectPhase}</td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Projects;
