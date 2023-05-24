import React, {useState} from 'react';
import AnimatedIconButton from "@/components/buttons/AnimatedIconButton";
import {AiFillFileAdd, AiOutlinePlus} from "react-icons/all";
import {BreadCrumbs} from "@/components/breadcrumbs/Breadcrumbs";
import CreatableSelect from 'react-select/creatable';

const AddProject = () => {
    const [isError, setIsError] = useState(null);
    const colorStyles = {
        control: (styles: any) => ({
            ...styles,
            backgroundColor: "white",
            borderRadius: "10px",
            height: "50px",
            boxShadow: 'none',
            borderColor: "#f3f3f3",
            ":hover": {
                boxShadow: 'none',
                borderColor: "#f78172",
            }, ":focus": {
                boxShadow: 'none',
                borderColor: "#f78172",
            },
        }),
        option: (styles: any, {data, isDisabled, isFocused, isSelected}) => {
            return {
                ...styles, color: "grey", ":hover": {
                    backgroundColor: "#f99d91",
                    color: "white"
                }, ":focus": {
                    boxShadow: 'none',
                    borderColor: "#f99d91",
                },
            };
        },
        multiValue: (styles: any, {data}) => {
            return {
                ...styles,
                backgroundColor: "#f78172",
                color: "#fff",
                borderRadius: "10px",
                paddingLeft: "5px",
                paddingRight: "5px",
                marginTop: "2px"
            };
        },
        multiValueLabel: (styles: any, {data}: any) => {
            return {
                ...styles,
                color: "#fff",
            };
        },
        multiValueRemove: (styles: any, {data}) => {
            return {
                ...styles,
                color: "#fff",
                cursor: "pointer",
                ":hover": {
                    color: "#fff",
                },
            };
        },
    };

    const options = [
        {value: "1", label: "Jack Dorsey"},
        {value: "2", label: "John Weber"},
        {value: "3", label: "Mike Vale"},
        {value: "4", label: "DJ Polner"},
        {value: "5", label: "Shooster"},
        {value: "6", label: "Marjan Goršek"},
        {value: "7", label: "Jože Gorišek"},
        {value: "8", label: "Tomislav Viher"},
        {value: "9", label: "Rado Radič"},
    ];
    const handleChange = (selectedOption, actionMeta) => {
        console.log("handleChange", selectedOption, actionMeta);
    };
    const handleInputChange = (inputValue, actionMeta) => {
        console.log("handleInputChange", inputValue, actionMeta);
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        const data = {
            first: event.target.first.value,
            last: event.target.last.value,
        };

        const endpoint = '/api/forms/addProject';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Error occurred');
            }

            const result = await response.json();
            // @ts-ignore
            setIsError(false);
        } catch (error: any) {
            // @ts-ignore
            setIsError(true);
            // Handle the error appropriately
        }
    };

    return (
        <div className="px-40 mb-20">
            <BreadCrumbs/>
            <form>
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-xl font-semibold leading-7 text-gray-900">Create project</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            This information will be displayed publicly so be careful what you share.
                        </p>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-4">
                                <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                                    Project name
                                </label>
                                <div className="mt-2">
                                    <div
                                        className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-main-500 sm:max-w-md">
                                        <input
                                            type="text"
                                            name="username"
                                            id="username"
                                            autoComplete="username"
                                            className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                            placeholder="Name your project..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-full">
                                <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                                    Description
                                </label>
                                <div className="mt-2">
                <textarea
                    id="about"
                    name="about"
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main-500 sm:text-sm sm:leading-6"
                    defaultValue={''}
                />
                                </div>
                                <p className="mt-3 text-sm leading-6 text-gray-600">Describe your project.</p>
                            </div>
                            <div className="col-span-full flex space-x-4">
                                <div className="w-1/3">
                                    <label htmlFor="country"
                                           className="block text-sm font-medium leading-6 text-gray-900">
                                        Construction type
                                    </label>
                                    <div className="mt-2">
                                        <select
                                            id="country"
                                            name="country"
                                            autoComplete="country-name"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-main-500 sm:max-w-xs sm:text-sm sm:leading-6"
                                        >
                                            <option>Mixed</option>
                                            <option>Test 2</option>
                                            <option>Test 3</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="w-1/5">
                                    <fieldset>
                                        <legend className="mt-3 text-sm leading-6 text-gray-600">Environment
                                            impact
                                        </legend>

                                        <div className="mt-4 space-x-6 flex items-center">
                                            <div className="flex items-center gap-x-3">
                                                <input
                                                    id="push-everything"
                                                    name="push-notifications"
                                                    type="radio"
                                                    className="h-4 w-4 border-gray-300 text-main-500 focus:ring-main-500"
                                                />
                                                <label htmlFor="push-everything"
                                                       className="block text-sm font-medium leading-6 text-gray-900">
                                                    Yes
                                                </label>
                                            </div>
                                            <div className="flex items-center gap-x-3">
                                                <input
                                                    id="push-email"
                                                    name="push-notifications"
                                                    type="radio"
                                                    className="h-4 w-4 border-gray-300 text-main-500 focus:ring-main-500"
                                                />
                                                <label htmlFor="push-email"
                                                       className="block text-sm font-medium leading-6 text-gray-900">
                                                    No
                                                </label>
                                            </div>

                                        </div>
                                    </fieldset>
                                </div>

                            </div>


                        </div>
                    </div>

                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-xl font-semibold leading-7 text-gray-900">Investors</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">Add required entities to your project.</p>

                        <div className="mt-10 ">
                            <CreatableSelect
                                placeholder={"Select investor..."}
                                options={options}
                                onChange={handleChange}
                                onInputChange={handleInputChange}
                                isMulti
                                styles={colorStyles}
                            />
                        </div>
                    </div>

                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-xl font-semibold leading-7 text-gray-900">Dokumentacija za pridobitev
                            projektnih pogojev </h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            Add DPP document, if you already have it prepared, otherwise you can always add it later on
                            project details.
                        </p>

                        <div className="mt-10 space-y-10">
                            <div className="col-span-full">
                                <label htmlFor="cover-photo"
                                       className="block text-sm font-medium leading-6 text-gray-900">
                                    DPP document
                                </label>
                                <div
                                    className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                    <div className="text-center">
                                        <AiFillFileAdd className="mx-auto h-12 w-12 text-gray-300"
                                                       aria-hidden="true"/>
                                        <div
                                            className="mt-4 flex items-center justify-center text-sm leading-6 text-gray-600">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer rounded-md  font-semibold text-main-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-main-200 focus-within:ring-offset-2 hover:text-main-500"
                                            >
                                                <span>Upload a file</span>
                                                <input id="file-upload" name="file-upload" type="file"
                                                       className="sr-only"/>
                                            </label>

                                        </div>
                                        <p className="text-xs leading-5 text-gray-600">PDF, DOCX, PNG up to 10MB</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 mb-40 flex items-center justify-end gap-x-6 pb-5">

                    <AnimatedIconButton text={"CREATE"} icon={<AiOutlinePlus/>}
                                        type={"submit"}></AnimatedIconButton>
                </div>
            </form>
        </div>
    );
};

export default AddProject;