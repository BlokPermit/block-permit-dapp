import React, {useState} from 'react';
import {UserType} from ".prisma/client";

import {AiOutlineUserAdd} from "react-icons/all";
import InputField from "@/components/generic/input/InputField";
import AnimatedIconButton from "@/components/generic/buttons/AnimatedIconButton";
import Button from "@/components/generic/buttons/Button";
import Dropdown from "@/components/generic/dropdown/Dropdown";

import OutlineButton from "@/components/generic/buttons/OutlineButton";
import useAlert from "@/hooks/AlertHook";


interface InvestorInput {
    name: string;
    streetAddress: string;
    taxId: string;
}

interface Option {
    value: any;
    label: string;
}


const AddInvestor = () => {
    const {setAlert} = useAlert();
    const emptyInvestor = {
        name: '',
        streetAddress: '',
        taxId: ''
    };

    const [userForm, setInvestorForm] = useState<InvestorInput>({...emptyInvestor});
    const [addedInvestors, setAddedInvestors] = useState<InvestorInput[]>([]);

    const isFormComplete = Object.values(userForm).every((field) => field !== '');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setInvestorForm({...userForm, [event.target.name]: event.target.value});
    }

    const handleAddUser = () => {
        setAddedInvestors([...addedInvestors, userForm]);
        setInvestorForm({...emptyInvestor});
    }

    const handleRemoveInvestor = (index: number) => {
        setAddedInvestors(addedInvestors.filter((_, i) => i !== index));
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await fetch("/api/investors", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(addedInvestors),
            });
            if (!response.ok) {
                throw new Error("Error occurred");
            }
            setAddedInvestors([]);
            setAlert({title: 'Success!', message: 'Investors added.', type: 'success'});
        } catch (error) {
            setAlert({title: 'Something went wrong', message: error as string, type: 'error'});
        }
    }

    return (
        <form onSubmit={handleSubmit} className="px-5 py-5">
            <div className="flex justify-end px-5 py-3 pb-0">
                {!isFormComplete ? <div className="mr-5 text-neutral-400">
                    *Fill all fields to add investor
                </div> : null}
                <div className="mr-5">
                    <OutlineButton text={"Add Investor"} onClick={handleAddUser} disabled={!isFormComplete}/>
                </div>
                <div>
                    <AnimatedIconButton icon={<AiOutlineUserAdd/>} text={"Create Investors"} type={"submit"}/>
                </div>
            </div>
            <div className="border-b border-gray-900/10 py-10  ">
                <div className="flex w-full px-5 space-x-4 justify-between items-center">
                    <div className="w-1/3">
                        <InputField id={"name"} name={"name"} label={"Full name"}
                                    placeholder={"Enter display name..."}
                                    type={"text"}
                                    onChange={handleInputChange}
                                    value={userForm.name}/>
                    </div>

                    <div className="w-1/3">
                        <InputField id={"streetAddress"} name={"streetAddress"}
                                    label={"Street address"}
                                    placeholder={"Enter street address..."}
                                    onChange={handleInputChange}
                                    type={"text"} value={userForm.streetAddress}/>
                    </div>
                    <div className="w-1/3">
                        <InputField id={"taxId"} name={"taxId"} label={"Tax Number"}
                                    placeholder={"Enter investors tax number..."}
                                    type={"text"}
                                    onChange={handleInputChange}
                                    value={userForm.taxId}/>
                    </div>
                </div>
            </div>
            {addedInvestors.map((user, i) => (
                <div key={i} className={`border-b ${i == 0 ? "border-t" : null} border-gray-900/10 py-5`}>
                    <div className="grid grid-cols-4 w-full items-center justify-between">
                        <div className="col-span-1">
                            <div className="text-neutral-400">Name</div>
                            <div style={{wordWrap: 'break-word'}}>{user.name}</div>
                        </div>
                        <div className="col-span-1">
                            <div className="text-neutral-400">Street Address</div>
                            <div style={{wordWrap: 'break-word'}}>{user.streetAddress}</div>
                        </div>
                        <div className="col-span-1">
                            <div className="text-neutral-400">Tax Number</div>
                            <div style={{wordWrap: 'break-word'}}>{user.taxId}</div>
                        </div>
                        <div className="col-span-1 text-right pr-5">
                            <Button text={"Remove Investor"} onClick={() => handleRemoveInvestor(i)}/>
                        </div>
                    </div>
                </div>
            ))}

        </form>
    );
}

export default AddInvestor;