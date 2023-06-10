import React from "react";
import ProtectedRoute from "@/components/generic/navigation/ProtectedRoute";
import { AiOutlineAppstoreAdd } from "react-icons/all";
import AnimatedIconButton from "@/components/generic/buttons/AnimatedIconButton";
import { getProjectsOfUserFromDatabase} from "@/lib/ProjectService";
import { InferGetServerSidePropsType } from "next/types";
import {Project, ProjectState, User} from "@prisma/client";
import { useRouter } from "next/router";
import InputField from "@/components/generic/input/InputField";
import Radio from "@/components/generic/input/Radio";
import ProgressBar from "@/components/specific/ProgressBar";
import {getProjectStateName} from "@/utils/EnumUtils";
import {getSession} from "next-auth/react";

export const getServerSideProps: any = async (context: any) => {
  try {
    const session = await getSession(context);

    if(!session){
      return {
        redirect: {
          destination: '/auth',
          permanent: false,
        },
      }
    } else {
      let projects: Project[] = await getProjectsOfUserFromDatabase(session.user.id?.toString() ?? "");
      return {
        props: {projects}
      }
    }
  } catch (error) {
    return { notFound: true };
  }
};

const Projects = ({ projects }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [searchText, setSearchText] = React.useState<string>("");
  const [environmentImpact, setEnvironmentImpact] = React.useState<boolean>();
  const [projectState, setProjectState] = React.useState<ProjectState>(ProjectState.AQUIRING_PROJECT_CONDITIONS);

  const filter = (project: Project): boolean => {
    return (
      (project.constructionTitle.toLowerCase().includes(searchText.toLowerCase()) ||
        project.constructionType.toLowerCase().includes(searchText.toLowerCase()) ||
        project.name.toLowerCase().includes(searchText.toLowerCase()) ||
        searchText === "") &&
      (environmentImpact === undefined || project.constructionImpactsEnvironment === environmentImpact) &&
      projectState === project.projectState
    );
  };

  return (
    <ProtectedRoute>
      <div className="px-12 pt-6">
        <div className="flex justify-between items-center">
          <div className="flex w-1/2 items-center">
            <h1 className="text-neutral-500 text-2xl font-semibold mr-6">Projekti</h1>
          </div>
          <AnimatedIconButton text={"Dodaj Projekt"} icon={<AiOutlineAppstoreAdd size={20} />} isLink={true} href={"/projects/addProject"}></AnimatedIconButton>
        </div>
        <div className="mt-8">
          <ProgressBar actualState={ProjectState.AQUIRING_BUILDING_PERMIT} selectedState={projectState} handleStateChange={(state: ProjectState) => setProjectState(state)} />
          <div className="my-3 grid grid-cols-6 gap-4">
            <span className="col-span-4">
              <InputField id={searchText} label={""} placeholder={"Išči projekte..."} type={"text"} onChange={(e) => setSearchText(e.target.value)} />
            </span>
            <span className="col-span-2">
              <Radio
                label={"Vpliva na okolje"}
                options={[
                  {
                    title: "Vpliva na okolje",
                    description: "Da",
                    value: true,
                  },
                  {
                    title: "Vpliva na okolje",
                    description: "Ne",
                    value: false,
                  },
                  {
                    title: "Vpliva na okolje",
                    description: "Vsi",
                    value: "all",
                  },
                ]}
                onChange={(e) => setEnvironmentImpact(e.target.value !== "all" ? e.target.value === "true" : undefined)}
              />
            </span>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm text-left">
              <thead>
                <tr>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Ime projekta</th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Ime zgradbe</th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Tip konstrukcije</th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Vpliv na okolje</th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Faza</th>
                </tr>
              </thead>
              {projects.map((project: Project) => (
                <tbody className="divide-y divide-gray-200">
                  {filter(project) && (
                    <tr className="hover:cursor-pointer hover:bg-gray-100" key={project.id} onClick={() => router.push(`/projects/${project.id}`)}>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-900">{project.name}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-900">{project.constructionTitle}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-900">{project.constructionType}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-900">{project.constructionImpactsEnvironment ? "Yes" : "No"}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-900">{getProjectStateName(project.projectState)}</td>
                    </tr>
                  )}
                </tbody>
              ))}
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Projects;
