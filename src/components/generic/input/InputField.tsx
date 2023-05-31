import React from "react";

interface InputFieldProps {
  id: string;
  label: string;
  placeholder: string;
  type: string;
}

const InputField = (props: InputFieldProps) => {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 pl-3">{props.label}</label>

      <input type={props.type} id={props.id} placeholder={props.placeholder} className="mt-1 w-full rounded-lg border border-gray-200 shadow-sm sm:text-sm h-12 p-3" />
    </div>
  );
};

export default InputField;
