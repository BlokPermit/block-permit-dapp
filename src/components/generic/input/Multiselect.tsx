import React, {useState} from 'react';
import CreatableSelect from "react-select/creatable";

interface Option {
    value: any;
    label: string;
}

interface MultiselectProps {
    options: Option[];
    onChange: (value: Option[]) => void;
}

const Multiselect = (props: MultiselectProps) => {
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
        option: (styles: any, {data, isDisabled, isFocused, isSelected}: any) => {
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
        multiValue: (styles: any, {data}: any) => {
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
        multiValueRemove: (styles: any, {data}: any) => {
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


    const handleChange = (options: any) => {
        props.onChange(options);
    };
    const handleInputChange = (inputValue: any, actionMeta: any) => {
    };

    return (
        <CreatableSelect
            placeholder={"Select investor..."}
            options={props.options}
            onChange={handleChange}
            onInputChange={handleInputChange}
            isMulti
            styles={colorStyles}
        />
    );
};

export default Multiselect;