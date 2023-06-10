import { FaCheck, FaPlus, FaSearch } from "react-icons/fa";
import IconButton from "../generic/buttons/IconButton";
import React, { useEffect, useState } from "react";
import { User } from "@prisma/client";
import AssessmentProviderResultItem from "./AssessmentProviderResultItem";
import { LoadingAnimation } from "../generic/loading-animation/LoadingAnimation";
import { getConnectedAddress } from "../../utils/MetamaskUtils";
import useAlert from "../../hooks/AlertHook";
import { useRouter } from "next/router";

interface AddAssessmentProvidersPopupProps {
  projectId: string;
  projectAddress: string;
  onClose: () => void;
  existingAssessmentProviders: User[];
}

const fetchUsers = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return response.json();
};

const AddAssessmentProvidersPopup = (props: AddAssessmentProvidersPopupProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [resultsVisible, setResultsVisible] = useState<boolean>(false);
  const [results, setResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const { setAlert } = useAlert();
  const router = useRouter();

  const handleSearch = async () => {
    const encodedSearchQuery = encodeURIComponent(searchQuery);
    const data = await fetchUsers(`/api/users/searchAssessmentProviders?q=${encodedSearchQuery}`);
    setResults(data.users.filter((assessmentProvider: User) => !props.existingAssessmentProviders.some((existingAssessmentProvider: User) => assessmentProvider.id === existingAssessmentProvider.id)));
    setResultsVisible(data.users.length > 0);
  };

  const handleSelect = async (user: User, action: "add" | "remove") => {
    if (action === "remove") {
      setSelectedUsers(selectedUsers.filter((selectedUser) => selectedUser.id !== user.id));
    }
    if (action === "add") {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleAdd = async () => {
    const addresses: string[] = selectedUsers.map((user: User) => user.walletAddress);

    try {
      const response = await fetch("/api/projects/addAssessmentProviders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectAddress: props.projectAddress,
          signerAddress: await getConnectedAddress(window),
          assessmentProvidersAddresses: addresses,
        }),
      });

      if (!response.ok) {
        throw new Error((await response.json()).message);
      } else {
        setAlert({ title: "", message: "Mnenjedajalci dodani.", type: "success" });

        router.push(router.asPath);
        props.onClose();
      }
    } catch (error: any) {
      setAlert({ title: "Error!", message: error.message, type: "error" });
    }
  };

  return (
    <div className="fixed z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <span className="fixed top-0 left-0 w-full h-full" onClick={props.onClose}></span>
      <span className="bg-white max-w-6xl w-1/2 rounded-lg shadow-xl bottom-52 relative">
        <div className="grid grid-cols-7 gap-2 m-3">
          <input className="col-span-5 border-none rounded-lg p-3 bg-gray-200" type="text" placeholder="Search Assessment Providers" onChange={(e) => setSearchQuery(e.target.value)} />
          <IconButton className="bg-gray-200" text="Search" icon={<FaSearch />} onClick={handleSearch} />
          <IconButton className={`text-white ${selectedUsers.length === 0 ? "bg-gray-200" : "bg-main-200"}`} text="Submit" icon={<FaPlus />} disabled={selectedUsers.length == 0} onClick={handleAdd} />
        </div>
        {selectedUsers.length > 0 && (
          <div className="m-3 border-b border-gray-200">
            {selectedUsers.map((user) => (
              <AssessmentProviderResultItem user={user} handleSelect={handleSelect} isAdded={true} />
            ))}
          </div>
        )}
        {resultsVisible && (
          <div className="m-3">
            {results.map((result) => (
              <span>{!selectedUsers.find((user) => result.id === user.id) && <AssessmentProviderResultItem user={result} handleSelect={handleSelect} />}</span>
            ))}
          </div>
        )}
      </span>
    </div>
  );
};

export default AddAssessmentProvidersPopup;
