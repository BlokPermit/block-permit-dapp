import React, { useState } from "react";
import { findBaseProjectById } from "@/lib/ProjectService";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import useAlert from "@/hooks/AlertHook";
import { BreadCrumbs } from "@/components/generic/navigation/Breadcrumbs";
import CreateProjectInputField from "@/components/generic/input/CreateProjectInputField";
import TextareaInputField from "@/components/generic/input/TextareaInputField";
import ConstructionTitleInput from "@/components/generic/input/ConstructionTitleInput";
import Dropdown from "@/components/generic/dropdown/Dropdown";
import DoubleRadioButtons from "@/components/generic/buttons/DoubleRadioButtons";
import OutlineButton from "@/components/generic/buttons/OutlineButton";
import InputField from "@/components/generic/input/InputField";
import Button from "@/components/generic/buttons/Button";
import AnimatedIconButton from "@/components/generic/buttons/AnimatedIconButton";
import { AiOutlinePlus } from "react-icons/all";
import { dropdownOptions, InvestorInput, Option } from "@/pages/projects/addProject";
import { Project } from "@prisma/client";

export const getServerSideProps: any = async (context: any) => {
  const id = context.params ? context.params.id : "";

  try {
    let project: Project = await findBaseProjectById(id?.toString() ?? "");
    return { props: { project } };
  } catch (error) {
    return { notFound: true };
  }
};

const EditProject = ({ project }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const emptyInvestor = {
    name: "",
    streetAddress: "",
    taxId: "",
    email: "",
    phoneNumber: "",
  };
  const router = useRouter();
  const [projectName, setProjectName] = useState<string>(project.name);
  const [constructionTitle, setConstructionTitle] = useState<string>(project.constructionTitle);
  const [selectedConstructionType, setSelectedConstructionType] = useState<Option>({
    label: project.constructionType,
    value: "1",
  });
  const [description, setDescription] = useState<string>(project.description);
  const [selectedEnvironmentImpact, setSelectedEnvironmentImpact] = useState<Option>({
    label: "No",
    value: project.constructionImpactsEnvironment,
  });
  const [userForm, setInvestorForm] = useState<InvestorInput>({ ...emptyInvestor });
  const [addedInvestors, setAddedInvestors] = useState<InvestorInput[]>(project.investors || []);
  const isFormComplete = Object.values(userForm).every((field) => field !== "");
  const { setAlert } = useAlert();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setInvestorForm({ ...userForm, [event.target.name]: event.target.value });
  };

  const handleAddInvestor = () => {
    setAddedInvestors([...addedInvestors, userForm]);
    setInvestorForm({ ...emptyInvestor });
  };

  const handleRemoveInvestor = (index: number) => {
    setAddedInvestors(addedInvestors.filter((_, i) => i !== index));
  };

  const handleDropdownChange = (option: Option): void => {
    setSelectedConstructionType(option);
  };
  const handleDescriptionChange = (value: string) => {
    setDescription(value);
  };
  const handleRadioChange = (option: any) => {
    setSelectedEnvironmentImpact(option);
  };
  const handleProjectNameChange = (value: string) => {
    setProjectName(value);
  };
  const handleConstructionTitleChange = (value: string) => {
    setConstructionTitle(value);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    try {
      const updatedProjectData = {
        ...project,
        name: projectName,
        constructionTitle: constructionTitle,
        description: description,
        constructionImpactsEnvironment: selectedEnvironmentImpact.value,
        constructionType: selectedConstructionType.label,
        investors: addedInvestors,
      };
      console.log(updatedProjectData);

      const response = await fetch("/api/projects", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project: updatedProjectData,
        }),
      });

      if (!response.ok) {
        throw new Error("Error saving project.");
      }

      let updatedProject = await response.json();
      // @ts-ignore
      await router.push(`/projects/${updatedProject.id}`);
      setAlert({ title: "Project updated!", message: "You can now view it in projects.", type: "success" });
    } catch (error: any) {
      setAlert({ title: "", message: error.message, type: "error" });
    }
  };

  return (
    <div>
      <div className="px-40 mb-20">
        <BreadCrumbs />
        <form onSubmit={handleSubmit}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-xl font-semibold leading-7 text-gray-900">Edit project</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">This information will be displayed publicly so be careful what you share.</p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <CreateProjectInputField initialValue={project.name} label={"Project Name"} onChange={handleProjectNameChange} />
                </div>

                <div className="col-span-full">
                  <TextareaInputField instructions={"Describe your project"} initialValue={project.description} onChange={handleDescriptionChange} title={"Description"} />
                </div>
                <div className="col-span-full flex justify-between space-x-4">
                  <div className="w-1/3 pr-20">
                    <ConstructionTitleInput initialValue={project.constructionTitle} label={"Construction title"} onChange={handleConstructionTitleChange} />
                  </div>
                  <div className="w-1/3">
                    <Dropdown initialValue={{ value: "1", label: project.constructionType }} label={"Construction Type"} onChange={handleDropdownChange} options={dropdownOptions} />
                  </div>
                  <div className="w-1/3">
                    <DoubleRadioButtons
                      label={"Environment Impact"}
                      initialValue={{ label: "", value: project.constructionImpactsEnvironment }}
                      options={[
                        { value: true, label: "Yes" },
                        {
                          value: false,
                          label: "No",
                        },
                      ]}
                      onRadioChange={handleRadioChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className=" pb-2">
              <div className="flex justify-between   pb-0">
                <div>
                  <h2 className="text-xl font-semibold leading-7 text-gray-900">Investors</h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">Add required investors to your project.</p>
                </div>
                <div className="flex ">
                  {!isFormComplete ? <div className="mr-5 text-neutral-400">*Fill all fields to add investor</div> : null}
                  <div className="">
                    <OutlineButton text={"Add Investor"} onClick={handleAddInvestor} disabled={!isFormComplete} />
                  </div>
                </div>
              </div>
              <div className="border-b border-gray-900/10 py-10 ">
                <div className="flex w-full ">
                  <div className="w-1/2 pr-5 space-y-2 ">
                    <InputField id={"name"} name={"name"} label={"Full name"} placeholder={"Enter display name..."} type={"text"} onChange={handleInputChange} value={userForm.name} />
                    <InputField id={"email"} name={"email"} label={"Email"} placeholder={"Enter email address..."} type={"text"} onChange={handleInputChange} value={userForm.email} />
                    <InputField id={"phoneNumber"} name={"phoneNumber"} label={"Phone"} placeholder={"Enter phone number..."} type={"text"} onChange={handleInputChange} value={userForm.phoneNumber} />
                  </div>
                  <div className="w-1/2 pl-5 space-y-2">
                    <InputField
                      id={"streetAddress"}
                      name={"streetAddress"}
                      label={"Street address"}
                      placeholder={"Enter street address..."}
                      onChange={handleInputChange}
                      type={"text"}
                      value={userForm.streetAddress}
                    />
                    <InputField id={"taxId"} name={"taxId"} label={"Tax Number"} placeholder={"Enter tax number..."} type={"text"} onChange={handleInputChange} value={userForm.taxId} />
                  </div>
                </div>
              </div>
              {addedInvestors.map((user, i) => (
                <div key={i} className={`border-b ${i == 0 ? "border-t" : null} border-gray-900/10 py-5`}>
                  <div className="grid grid-cols-6 w-full items-center justify-between">
                    <div className="col-span-1">
                      <div className="text-neutral-400">Name</div>
                      <div style={{ wordWrap: "break-word" }}>{user.name}</div>
                    </div>
                    <div className="col-span-1">
                      <div className="text-neutral-400">Street Address</div>
                      <div style={{ wordWrap: "break-word" }}>{user.streetAddress}</div>
                    </div>
                    <div className="col-span-1">
                      <div className="text-neutral-400">Tax Number</div>
                      <div style={{ wordWrap: "break-word" }}>{user.taxId}</div>
                    </div>
                    <div className="col-span-1">
                      <div className="text-neutral-400">Email</div>
                      <div style={{ wordWrap: "break-word" }}>{user.email}</div>
                    </div>
                    <div className="col-span-1">
                      <div className="text-neutral-400">Phone Number</div>
                      <div style={{ wordWrap: "break-word" }}>{user.phoneNumber}</div>
                    </div>
                    <div className="col-span-1 text-right pr-5">
                      <Button text={"Remove"} onClick={() => handleRemoveInvestor(i)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 mb-40 flex items-center justify-end gap-x-6 pb-5">
            <AnimatedIconButton text={"UPDATE"} icon={<AiOutlinePlus />} type={"submit"}></AnimatedIconButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProject;
