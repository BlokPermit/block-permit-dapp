import { DocumentContractModel } from "@/models/DocumentContractModel";
import React from "react";
import { FaCalendarMinus, FaCalendarPlus, FaEnvelope, FaExclamation, FaHeading, FaMapMarker, FaPhone, FaTimes } from "react-icons/fa";
import IconCard from "../generic/data-view/IconCard";
import { dateFromTimestamp, formatDate } from "@/utils/DateUtils";
import IconButton from "../generic/buttons/IconButton";
import useAlert from "@/hooks/AlertHook";
import { useRouter } from "next/router";
import { getConnectedAddress } from "@/utils/MetamaskUtils";
import { User } from "@prisma/client";

interface AssessmentProviderInfoPopupProps {
  documentContract?: DocumentContractModel;
  assessmentProvider: User;
  projectAddress: string;
  onClose: () => void;
}

const AssessmentProviderInfoPopup = (props: AssessmentProviderInfoPopupProps) => {
  const router = useRouter();
  const { setAlert } = useAlert();

  const handleRemoveAssessmentProvider = async () => {
    const response = await fetch(`/api/projects/removeAssessmentProviders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectAddress: props.projectAddress,
        signerAddress: await getConnectedAddress(window),
        assessmentProvidersAddresses: [props.assessmentProvider.walletAddress],
      }),
    });

    if (response.ok) {
      setAlert({ title: "", message: `Mnenjedajalec ${props.assessmentProvider.name} odstranjen.`, type: "success" });
      router.push(router.asPath);
    } else {
      setAlert({ title: "", message: (await response.json()).message, type: "error" });
    }
    router.push(router.asPath);
  };

  const handleRequestedDueDateExtensionEvaluation = async (confirmed: boolean) => {
    const response = await fetch(`/api/documentContracts/evaluateAssessmentDueDateExtension`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        documentContractAddress: props.documentContract!.documentContractAddress,
        signerAddress: await getConnectedAddress(window),
        confirmed: confirmed,
      }),
    });

    if (response.ok) {
      setAlert({ title: "", message: `Rok za ocenitev ${confirmed ? "sprejet" : "zavrnjen"}`, type: "success" });
      router.push(router.asPath);
    } else {
      setAlert({ title: "", message: (await response.json()).message, type: "error" });
    }
  };

  return (
    <div className="fixed z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <span className="fixed top-0 left-0 w-full h-full" onClick={props.onClose}></span>
      <div className="max-w-6xl w-full rounded-lg bg-gray-100 p-4 shadow-lg sm:p-6 lg:p-8 relative">
        <div className="absolute top-5 right-5">
          <FaTimes className="hover:text-gray-500 hover:cursor-pointer" size={20} onClick={props.onClose} />
        </div>
        {props.documentContract && (
          <>
            <div className="flex justify-between gap-3 mt-10 bg-white px-5 py-3 rounded-lg">
              <h1 className="flex items-center">
                Rok za oddajo mnenja: <span className="ms-2 text-xl font-semibold">{formatDate(dateFromTimestamp(props.documentContract.assessmentDueDate!))}</span>
              </h1>
              <div>
                {props.documentContract.requestedAssessmentDueDate && (
                  <div className="inline-flex gap-3">
                    <IconButton
                      className="text-white bg-green-700 hover:text-green-700 hover:bg-white"
                      text={"Potrdi podaljšanje roka"}
                      icon={<FaCalendarPlus />}
                      onClick={() => handleRequestedDueDateExtensionEvaluation(true)}
                    />
                    <IconButton
                      className="text-white bg-red-600 hover:text-red-600 hover:bg-white"
                      text={"Zavrni podaljšanje roka"}
                      icon={<FaCalendarMinus />}
                      onClick={() => handleRequestedDueDateExtensionEvaluation(false)}
                    />
                  </div>
                )}
              </div>
            </div>
            {props.documentContract.mainDocumentUpdateRequested && (
              <div className="mt-5 inline-flex items-center text-main-200 font-semibold gap-3 border-2 border-main-200 bg-white px-5 py-3 rounded-lg">
                <FaExclamation />
                Zahtevana posodobitev dokumenta
              </div>
            )}
          </>
        )}
        <div className="mt-10">
          <h1 className="text-xl mb-3 font-semibold">Osnovne informacije</h1>
          <IconCard title={"Ime"} value={props.assessmentProvider.name} icon={<FaHeading />} />
          <IconCard title={"Naslov"} value={props.assessmentProvider.streetAddress} icon={<FaMapMarker />} />
          {props.assessmentProvider.phone && <IconCard title={"Telefon"} value={props.assessmentProvider.phone} icon={<FaPhone />} />}
          <IconCard title={"E-pošta"} value={props.assessmentProvider.email} icon={<FaEnvelope />} />
        </div>
        <div className="flex justify-end">
          {props.documentContract && !props.documentContract.isClosed && (
            <IconButton className="bg-red-500 text-white hover:bg-white hover:text-red-600" text={"Odstrani"} icon={<FaTimes />} onClick={() => handleRemoveAssessmentProvider()} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentProviderInfoPopup;
