import { findProjectById, getProjectsOfUserFromDatabase } from "@/lib/ProjectService";
import { ProjectState } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { InferGetServerSidePropsType } from "next";
import { BreadCrumbs } from "@/components/generic/navigation/Breadcrumbs";
import { FaEdit, FaFileContract, FaHeading, FaLandmark, FaPlus, FaTag } from "react-icons/all";
import IconButton from "@/components/generic/buttons/IconButton";
import DocumentDropdown from "@/components/generic/dropdown/DocumentDropdown";
import IconCard from "@/components/generic/data-view/IconCard";
import ProgressBar from "@/components/specific/ProgressBar";
import RoleBasedComponent from "@/components/generic/RoleBasedComponent";
import { setRecentProject } from "@/utils/LocalStorageUtil";
import { ProjectModel } from "@/models/ProjectModel";
import { DocumentContractModel } from "@/models/DocumentContractModel";
import InvestorsView from "@/components/specific/InvestorsView";
import { useRouter } from "next/router";
import { zipAndDownload } from "../../lib/DocumentService";
import useAlert from "../../hooks/AlertHook";
import Link from "next/link";
import { getSetMainDocumentText, mailUser } from "../../utils/MailingUtils";
import AdministrativeAuthorityPopup from "@/components/specific/AdministrativeAuthorityPopup";
import ProjectManagerView from "@/components/specific/ProjectManagerView";
import AssessmentProviderView from "@/components/specific/AssessmentProviderView";
import { getSession } from "next-auth/react";

export const getServerSideProps: any = async (context: any) => {
  const id = context.params ? context.params.id : "";

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
      let loggedInUser = session.user;
      let project: ProjectModel = await findProjectById(id?.toString() ?? "");
      return { props: { project, loggedInUser } };
    }
  } catch (error) {
    return { notFound: true };
  }
};

const ProjectPage = ({ project, loggedInUser }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { setAlert } = useAlert();
  const [isAdministrativeAuthorityPopupOpen, setIsAdministrativeAuthorityPopupOpen] = useState<boolean>(false);
  const [selectedState, setSelectedState] = useState<ProjectState>(project.baseProject.projectState);

  useEffect(() => {
    setRecentProject(project.baseProject.id);
  }, []);

  const downloadZip = async (paths: string[], zipName: string): Promise<boolean> => {
    try {
      await zipAndDownload(paths, zipName);
    } catch (e: any) {
      console.log(e);
      setAlert({ title: "", message: e.message, type: "error" });
    }
    return false;
  };

  const onMainDocumentChange = async () => {
    const relevantEmails: string[] =
      project.baseProject.projectState == ProjectState.AQUIRING_PROJECT_CONDITIONS
        ? project.sentDPPs.map((documentContract: DocumentContractModel) => documentContract.assessmentProvider.email)
        : project.sentDGDs.map((documentContract: DocumentContractModel) => documentContract.assessmentProvider.email);
    try {
      if (relevantEmails.length != 0) {
        const responseMail = await mailUser({
          to: relevantEmails,
          subject: `${project.baseProject.name} - Posodobljen ${project.baseProject.projectState == ProjectState.AQUIRING_PROJECT_CONDITIONS ? "DPP" : "DGD"}`,
          text: getSetMainDocumentText(project.baseProject.name, project.baseProject.projectState),
          link: router.asPath,
        });
        if (!responseMail.ok) throw new Error((await responseMail.json()).message);
      }
    } catch (e: any) {
      setAlert({ title: "", message: "Napaka pri pošiljanju e-pošte", type: "error" });
    } finally {
      router.push(router.asPath);
    }
  };

  const handleAdministrativeAuthorityChange = (): void => {
    setIsAdministrativeAuthorityPopupOpen(false);
    router.push(router.asPath);
  };

  return (
    <div className="px-40 mb-10">
      <BreadCrumbs  projectName={project.baseProject.name}/>
      <ProgressBar className="my-16" actualState={project.baseProject.projectState} selectedState={selectedState} handleStateChange={(state: ProjectState) => setSelectedState(state)} />
      <div className="flex justify-between mb-10">
        <span className="inline-flex items-center gap-3">
          <h1 className="text-3xl font-semibold text-neutral-900">{project.baseProject.name}</h1>
          <RoleBasedComponent
            projectManagerComponent={
              <Link href={`/projects/editProject/${project.baseProject.id}`}>
                <IconButton className="text-main-200 border-gray-50 rounded-none hover:border-b-main-200" icon={<FaEdit />} text={"Uredi Projekt"} onClick={() => {}} />
              </Link>
            }
          />
        </span>
        <div className="flex items-center gap-5">
          <RoleBasedComponent
            projectManagerComponent={
              <>
                <IconButton
                  className="text-main-200 border-gray-50 bg-inherit rounded-none hover:border-b-main-200"
                  icon={project.administrativeAuthority ? <FaLandmark /> : <FaPlus />}
                  text={project.administrativeAuthority ? project.administrativeAuthority.name : "Dodaj upravni organ"}
                  onClick={() => setIsAdministrativeAuthorityPopupOpen(true)}
                />
                {isAdministrativeAuthorityPopupOpen && (
                  <AdministrativeAuthorityPopup
                    administrativeAuthority={project.administrativeAuthority ? project.administrativeAuthority : null}
                    projectAddress={project.baseProject.smartContractAddress}
                    onClose={() => setIsAdministrativeAuthorityPopupOpen(false)}
                    onSubmit={handleAdministrativeAuthorityChange}
                  />
                )}
              </>
            }
          />
          <DocumentDropdown
            documentId={selectedState == ProjectState.AQUIRING_PROJECT_CONDITIONS ? project.DPPUrl ?? "" : project.DGDUrl ?? ""}
            documentType={selectedState == ProjectState.AQUIRING_PROJECT_CONDITIONS ? "dpp" : "dgd"}
            fileName={selectedState == ProjectState.AQUIRING_PROJECT_CONDITIONS ? project.DPPUrl : project.DGDUrl}
            path={`projects/${project.baseProject.id}/${selectedState == ProjectState.AQUIRING_PROJECT_CONDITIONS ? "DPP" : "DGD"}`}
            onDocumentChange={onMainDocumentChange}
            projectAddress={project.baseProject.smartContractAddress}
          />
        </div>
      </div>
      <div className="my-10 py-5 border-y border-gray-200">
        <p className="text-gray-500 text-sm">Opis</p>
        <p className="text-black mt-2">{project.baseProject.description}</p>
      </div>
      <div className="grid grid-cols-8 gap-12 border-b border-gray-900/10 mb-10">
        <div className="col-span-3 pb-12">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-5">Podatki o gradnji</h2>
          <IconCard icon={<FaHeading />} title="Naziv zgradbe" value={project.baseProject.constructionTitle} />
          <IconCard icon={<FaTag />} title="Tip konstrukcije" value={project.baseProject.constructionType} />
          <IconCard icon={<FaFileContract />} title="Vpliv na okolje?" value={project.baseProject.constructionImpactsEnvironment ? "Yes" : "No"} />
        </div>
        <div className="col-span-5">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-5">Investitorji</h2>
          <InvestorsView
            investors={project.baseProject.investors}
            projectId={project.baseProject.id}
            projectUpdateInfo={{
              projectName: project.baseProject.name,
              projectManagerInfo: project.projectManager,
              numOfAssessmentProviders: project.numOfAssessmentProviders,
              numOfSentDPPs: project.numOfSentDPPs,
              numOfAssessedDPPs: project.numOfAssessedDPPs,
              numOfSentDGDs: project.numOfSentDGDs,
              numOfAssessedDGDs: project.numOfAssessedDGDs,
            }}
          />
        </div>
      </div>
      <RoleBasedComponent projectManagerComponent={<ProjectManagerView project={project} selectedState={selectedState} downloadZip={downloadZip} />} />
      <RoleBasedComponent
        assessmentProviderComponent={
          <div className="pb-10">
            <AssessmentProviderView
              project={project}
              selectedState={selectedState}
              loggedInAssessmentProvider={loggedInUser}
              documentContract={
                selectedState === ProjectState.AQUIRING_PROJECT_CONDITIONS
                  ? project.sentDPPs.find((documentContract: DocumentContractModel) => documentContract.assessmentProvider.id === loggedInUser.id)
                  : project.sentDGDs.find((documentContract: DocumentContractModel) => documentContract.assessmentProvider.id === loggedInUser.id)
              }
            />
          </div>
        }
      />
    </div>
  );
};

export default ProjectPage;
