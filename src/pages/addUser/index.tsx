import {useState} from 'react';
import {UserType} from ".prisma/client";
import IconButton from "@/components/generic/buttons/IconButton";
import {AiOutlineClear, AiOutlineUserAdd} from "react-icons/all";
import InputField from "@/components/generic/input/InputField";
import AnimatedIconButton from "@/components/generic/buttons/AnimatedIconButton";
import Button from "@/components/generic/buttons/Button";
import Dropdown from "@/components/generic/dropdown/Dropdown";
import AnimatedOutlinedIconButton from "@/components/generic/buttons/AnimatedOutlinedIconButton";
import OutlineButton from "@/components/generic/buttons/OutlineButton";

interface UserInput {
    name: string;
    email: string;
    phone: string;
    streetAddress: string;
    walletAddress: string;
    userType: UserType;
}

const AddUser = () => {
    const [users, setUsers] = useState<UserInput[]>([
        {name: '', email: '', phone: '', streetAddress: '', walletAddress: '', userType: UserType.OPINION_PROVIDER},
    ]);

    const handleAddUser = () => {
        setUsers([...users, {
            name: '',
            email: '',
            phone: '',
            streetAddress: '',
            walletAddress: '',
            userType: UserType.OPINION_PROVIDER
        }]);
    }

    const handleRemoveUser = (index: number) => {
        setUsers(users.filter((_, i) => i !== index));
    }

    const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const values = [...users];
        values[index][event.target.name] = event.target.value;
        setUsers(values);
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        // Here you would send a POST request to your server-side API with the array of users.
    }

    return (
        <form onSubmit={handleSubmit} className="px-5 py-5">
            <div className="flex justify-end px-5 py-3">
                <div className="mr-5">
                    <OutlineButton text={"Add User"} onClick={handleAddUser}/>
                </div>
                <div>
                    <AnimatedIconButton icon={<AiOutlineUserAdd/>} text={"Create users"} type={"submit"}/>
                </div>
            </div>
            {users.map((user, i) => (
                <div className="border-b border-gray-900/10 pb-8 mb-6">
                    <div key={i} className="flex w-full">
                        <div className="w-1/2 px-5 space-y-1 ">
                            <InputField id={"1"} label={"Name"} placeholder={"Enter display name..."} type={"text"}/>
                            <InputField id={"1"} label={"Email"} placeholder={"Enter email address..."} type={"text"}/>
                            <InputField id={"1"} label={"Phone"} placeholder={"Enter phone number..."} type={"text"}/>
                        </div>
                        <div className="w-1/2 px-5 space-y-1">
                            <InputField id={"1"} label={"Street address"} placeholder={"Enter street address..."}
                                        type={"text"}/>
                            <InputField id={"1"} label={"Wallet address"} placeholder={"0xBB39C4ac246cF3e10828..."}
                                        type={"text"}/>
                            <div className="flex justify-between items-center">
                                <div className="w-1/2">
                                    <Dropdown label={"Role"} options={[]} onChange={() => {
                                    }}/>
                                </div>
                                <div className="w-1/2 flex justify-end h-1/2 pt-5">
                                    <Button text={"Remove User"} onClick={() => handleRemoveUser(i)}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 px-5 flex justify-end">

                    </div>
                </div>
            ))}
        </form>
    );
}

export default AddUser;