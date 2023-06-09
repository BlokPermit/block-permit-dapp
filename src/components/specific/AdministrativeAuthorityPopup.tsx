import { User } from "@prisma/client";
import IconCard from "../generic/data-view/IconCard";
import { FaHeading, FaMapMarker, FaPhone, FaEnvelope, FaSearch, FaEdit, FaTimes } from "react-icons/fa";
import IconButton from "../generic/buttons/IconButton";
import { useState } from "react";
import { getConnectedAddress } from "@/utils/MetamaskUtils";
import useAlert from "@/hooks/AlertHook";

interface AdministrativeAuthorityPopupProps {
  administrativeAuthority: User | null;
  projectAddress: string;
  onClose: () => void;
  onSubmit: () => void;
}

const fetchUsers = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return response.json();
};

const AdministrativeAuthorityPopup = (props: AdministrativeAuthorityPopupProps) => {
  const { setAlert } = useAlert();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [results, setResults] = useState<User[]>([]);
  const [showSearch, setShowSearch] = useState<boolean>(false);

  const handleSearch = async () => {
    const encodedSearchQuery = encodeURIComponent(searchQuery);
    const data = await fetchUsers(`/api/users/searchAdministrativeAuthorities?q=${encodedSearchQuery}`);
    setResults(data.users.filter((user: User) => props.administrativeAuthority && user.walletAddress !== props.administrativeAuthority.walletAddress));
  };

  const handleSelect = async (walletAddress: string) => {
    const response = await fetch(`/api/projects/changeAdministrativeAuthority`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        administrativeAuthorityAddress: walletAddress,
        projectAddress: props.projectAddress,
        signerAddress: await getConnectedAddress(window),
      }),
    });

    if (response.ok) {
      props.onSubmit();
      setAlert({ title: "Uspeh", message: "Uspešno ste dodali upravni organ.", type: "success" });
    } else {
      setAlert({ title: "Napaka", message: "Prišlo je do napake pri dodajanju upravnega organa.", type: "error" });
    }
  };

  return (
    <div className="fixed z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <span className="fixed top-0 left-0 w-full h-full" onClick={props.onClose}></span>
      <div className="max-w-6xl w-full rounded-lg bg-gray-100 p-4 shadow-lg sm:p-6 lg:p-8 relative">
        <div className="absolute top-5 right-5">
          <FaTimes className="hover:text-gray-500 hover:cursor-pointer" size={20} onClick={props.onClose} />
        </div>
        {props.administrativeAuthority && (
          <div className="mt-10">
            <IconCard title={"Ime"} value={props.administrativeAuthority.name} icon={<FaHeading />} />
            <IconCard title={"Naslov"} value={props.administrativeAuthority.streetAddress} icon={<FaMapMarker />} />
            {props.administrativeAuthority.phone && <IconCard title={"Telefon"} value={props.administrativeAuthority.phone} icon={<FaPhone />} />}
            <IconCard title={"E-pošta"} value={props.administrativeAuthority.email} icon={<FaEnvelope />} />
            <span className="flex justify-end mb-5">
              <IconButton
                className="border-main-200 bg-main-200 text-white hover:bg-white hover:text-main-200"
                text={showSearch ? "Zapri iskanje" : "Išči upravne organe"}
                icon={showSearch ? <FaTimes /> : <FaSearch />}
                onClick={() => setShowSearch(!showSearch)}
              />
            </span>
          </div>
        )}
        {(!props.administrativeAuthority || showSearch) && (
          <div className="mt-7">
            <div className="grid grid-cols-8 gap-3">
              <input className="col-span-7 border-none rounded-lg bg-gray-200 p-3" type="text" placeholder="Išči upravne organe" onChange={(e) => setSearchQuery(e.target.value)} />
              <IconButton className="border-gray-200 bg-gray-200" text="Išči" icon={<FaSearch />} onClick={handleSearch} />
            </div>
            {results.length > 0 && (
              <div>
                <p className="text-gray-500 my-5">Ob kliku na izbran upravni organ se bo le te zamenjal za celoten projekt.</p>
                {results.map((result) => (
                  <div className="p-4 mt-2 rounded-lg hover:bg-gray-200 hover:cursor-pointer" onClick={() => handleSelect(result.walletAddress)}>
                    <p className="text-lg font-semibold">{result.name}</p>
                    <div className="flex justify-between">
                      <p className="text-gray-500">{result.streetAddress}</p>
                      <p className="text-gray-500">{result.email}</p>
                      <p className="text-gray-500">{result.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdministrativeAuthorityPopup;
