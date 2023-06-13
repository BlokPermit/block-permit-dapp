import React, { useState } from "react";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import useAlert from "@/hooks/AlertHook";
import { BreadCrumbs } from "@/components/generic/navigation/Breadcrumbs";
import AnimatedIconButton from "@/components/generic/buttons/AnimatedIconButton";
import { AiOutlinePlus } from "react-icons/all";
import { User} from "@prisma/client";
import { findUserById} from "@/lib/UserService";
import UserInputField from "@/components/generic/input/UserInputField";

export const getServerSideProps: any = async (context: any) => {
    const id = context.params ? context.params.id : "";

    try {
        let user: User | null = await findUserById(id?.toString() ?? "");
        return { props: { user } };
    } catch (error) {
        return { notFound: true };
    }
};

const EditUser = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter();
    const [name, setName] = useState<string>(user.name);
    const [email, setEmail] = useState<string>(user.email);
    const [streetAddress, setStreetAddress] = useState<string>(user.streetAddress);
    const [phone, setPhone] = useState<string>(user.phone);
    const { setAlert } = useAlert();


    const handleNameChange = (value: string) => {
        setName(value);
    };

    const handleEmailChange = (value: string) => {
        setEmail(value);
    };

    const handleStreetAddressChange = (value: string) => {
        setStreetAddress(value);
    };

    const handlePhoneChange = (value: string) => {
        setPhone(value);
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        try {
            const userData = {
                ...user,
                name: name,
                email: email,
                streetAddress: streetAddress,
                phone: phone,
            };

            const response = await fetch("/api/users", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user: userData,
                }),
            });

            if (!response.ok) {
                throw new Error("Error saving user.");
            }

            // @ts-ignore
            await router.push(`/user`);
            setAlert({ title: "Profile updated!", message: "You can now view it on user page.", type: "success" });
        } catch (error: any) {
            setAlert({ title: "", message: error.message, type: "error" });
        }
    };

    return (
        <div>
            <div className="px-40 mb-20">
                <BreadCrumbs projectName={user.name}/>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-12 mt-5">
                        <div className="border-b border-gray-900/10 pb-12">
                            <h2 className="text-xl font-semibold leading-7 text-gray-900">Uredi račun</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">Ti podatki bodo javno dostopni, zato pazite ob vnosu.</p>

                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-3">
                                    <UserInputField id={"name"} name={"name"} label={"Naziv"} placeholder={"Vnesite naziv..."} type={"text"} onChange={handleNameChange} value={name} />
                                </div>
                                <div className="sm:col-span-3">
                                    <UserInputField id={"email"} name={"email"} label={"E-poštni naslov"} placeholder={"Vnesite e-poštni naslov..."} type={"text"} onChange={handleEmailChange} value={email} />
                                </div>
                                <div className="sm:col-span-3">
                                    <UserInputField id={"streetAddress"} name={"streetAddress"} label={"Naslov"} placeholder={"Vnesite naslov..."} type={"text"} onChange={handleStreetAddressChange} value={streetAddress} />
                                </div>
                                <div className="sm:col-span-3">
                                    <UserInputField id={"phone"} name={"phone"} label={"Telefonska številka"} placeholder={"Vnesite telefonsko številko..."} type={"text"} onChange={handlePhoneChange} value={phone} />
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="mt-6 mb-40 flex items-center justify-end gap-x-6 pb-5">
                        <AnimatedIconButton text={"POSODOBI"} icon={<AiOutlinePlus />} type={"submit"}></AnimatedIconButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUser;
