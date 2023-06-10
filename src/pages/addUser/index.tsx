import React, {useState} from "react";
import {UserType} from ".prisma/client";

import {AiOutlineUserAdd} from "react-icons/all";
import InputField from "@/components/generic/input/InputField";
import AnimatedIconButton from "@/components/generic/buttons/AnimatedIconButton";
import Button from "@/components/generic/buttons/Button";
import Dropdown from "@/components/generic/dropdown/Dropdown";

import OutlineButton from "@/components/generic/buttons/OutlineButton";
import useAlert from "@/hooks/AlertHook";
import {ethers} from "ethers";

interface UserInput {
    name: string;
    email: string;
    phone: string;
    streetAddress: string;
    walletAddress: string;
    userType: UserType;
}

interface Option {
    value: any;
    label: string;
}

declare global {
    interface Window {
        ethereum: any;
    }
}

const options: Option[] = [
    {
        value: UserType.PROJECT_MANAGER,
        label: "Project Manager",
    },
    {
        value: UserType.ADMINISTRATIVE_AUTHORITY,
        label: "Administrative Authority",
    },
    {
        value: UserType.ASSESSMENT_PROVIDER,
        label: "Opinion Provider",
    },
    {
        value: UserType.ADMIN,
        label: "Admin",
    },
];

const UserTypeDisplay = {
    [UserType.ADMIN]: "Admin",
    [UserType.ASSESSMENT_PROVIDER]: "Opinion Provider",
    [UserType.PROJECT_MANAGER]: "Project Manager",
    [UserType.ADMINISTRATIVE_AUTHORITY]: "Administrative Authority",
};

const AddUser = () => {
    const {setAlert} = useAlert();
    const emptyUser = {
        name: "",
        email: "",
        phone: "",
        streetAddress: "",
        walletAddress: "",
        userType: UserType.PROJECT_MANAGER,
    };

    const [userForm, setUserForm] = useState<UserInput>({...emptyUser});
    const [addedUsers, setAddedUsers] = useState<UserInput[]>([]);

    const isFormComplete = Object.values(userForm).every((field) => field !== "");

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setUserForm({...userForm, [event.target.name]: event.target.value});
    };
    const handleDropdownChange = (option: Option) => {
        setUserForm({...userForm, userType: option.value});
    };

    const handleAddUser = () => {
        setAddedUsers([...addedUsers, userForm]);
        setUserForm({...emptyUser}); // reset form
    };

    const handleRemoveUser = (index: number) => {
        setAddedUsers(addedUsers.filter((_, i) => i !== index));
    };

    //TODO: Move all logic to lib folder. Frontend should be separate from logic.
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();

            console.log(signer);
            console.log(addedUsers.map((user) => user.walletAddress));
            console.log(JSON.stringify({
                addresses: addedUsers.map((user) => user.walletAddress),
                signer: await signer.getAddress()
            }));


            const blockchainResponse = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    addresses: addedUsers.map((user) => user.walletAddress),
                    signer: await signer.getAddress()
                })
            });

            if (!blockchainResponse.ok) {
                throw new Error("Error saving users on blockchain. Please try again.");
            }
            const response = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(addedUsers),
            });
            if (!response.ok) {
                console.log(response);
                throw new Error("Error saving users. Please try again.");
            }
            setAddedUsers([]);
            setAlert({title: "Success!", message: "Users added.", type: "success"});
        } catch (error: Error | any) {
            setAlert({title: "Something went wrong", message: error.message, type: "error"});
        }
    };

    return (
        <form onSubmit={handleSubmit} className="px-5 py-5 ">
            <div className="flex justify-end px-5 py-3 pb-0">
                {!isFormComplete ? <div className="mr-5 text-neutral-400">*Zapolni vsa polja, da lahko dodaš uporabnika</div> : null}
                <div className="mr-5">
                    <OutlineButton text={"Dodaj uporabnika"} onClick={handleAddUser} disabled={!isFormComplete}/>
                </div>
                <div>
                    <AnimatedIconButton icon={<AiOutlineUserAdd/>} text={"Ustvari uporabnike"} type={"submit"}/>
                </div>
            </div>
            <div className="border-b border-gray-900/10 py-10  ">
                <div className="flex w-full ">
                    <div className="w-1/2 px-5 space-y-2 ">
                        <InputField id={"name"} name={"name"} label={"Ime"} placeholder={"Vnesi ime..."}
                                    type={"text"} onChange={handleInputChange} value={userForm.name}/>
                        <InputField id={"email"} name={"email"} label={"Elektronski naslov"} placeholder={"Vnesi elektronski naslov..."}
                                    type={"text"} onChange={handleInputChange} value={userForm.email}/>
                        <InputField id={"phone"} name={"phone"} label={"Telefon"} placeholder={"Vnesi telefon..."}
                                    type={"text"} onChange={handleInputChange} value={userForm.phone}/>
                    </div>
                    <div className="w-1/2 px-5 space-y-2">
                        <InputField
                            id={"streetAddress"}
                            name={"streetAddress"}
                            label={"Naslov"}
                            placeholder={"Vnesi naslov..."}
                            onChange={handleInputChange}
                            type={"text"}
                            value={userForm.streetAddress}
                        />
                        <InputField
                            id={"walletAddress"}
                            name={"walletAddress"}
                            label={"Naslov denarnice"}
                            placeholder={"0xBB39C4ac246cF3e10828..."}
                            onChange={handleInputChange}
                            type={"text"}
                            value={userForm.walletAddress}
                        />
                        <Dropdown label={"Tip uporabnika"} options={options} onChange={handleDropdownChange}/>
                    </div>
                </div>
            </div>
            {addedUsers.map((user, i) => (
                <div key={i} className={`border-b ${i == 0 ? "border-t" : null} border-gray-900/10 py-5`}>
                    <div className="grid grid-cols-7 w-full items-center justify-between">
                        <div className="col-span-1">
                            <div className="text-neutral-400">Ime</div>
                            <div style={{wordWrap: "break-word"}}>{user.name}</div>
                        </div>
                        <div className="col-span-1">
                            <div className="text-neutral-400">Elektronski naslov</div>
                            <div style={{wordWrap: "break-word"}}>{user.email}</div>
                        </div>
                        <div className="col-span-1">
                            <div className="text-neutral-400">Telefon</div>
                            <div style={{wordWrap: "break-word"}}>{user.phone}</div>
                        </div>
                        <div className="col-span-1">
                            <div className="text-neutral-400">Naslov</div>
                            <div style={{wordWrap: "break-word"}}>{user.streetAddress}</div>
                        </div>
                        <div className="col-span-1">
                            <div className="text-neutral-400">Naslov denarnice</div>
                            <div style={{wordWrap: "break-word"}}>{user.walletAddress}</div>
                        </div>
                        <div className="col-span-1">
                            <div className="text-neutral-400">Tip uporabnika</div>
                            <div style={{wordWrap: "break-word"}}>{UserTypeDisplay[user.userType]}</div>
                        </div>
                        <div className="col-span-1 text-right pr-5">
                            <Button text={"Odstrani"} onClick={() => handleRemoveUser(i)}/>
                        </div>
                    </div>
                </div>
            ))}
        </form>
    );
};

export default AddUser;
