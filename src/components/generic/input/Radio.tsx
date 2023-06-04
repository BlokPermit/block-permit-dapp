import React from "react";

interface Opiton {
  title: string;
  description: string;
  value: any;
  checked?: boolean;
}

interface RadioProps {
  label: string;
  options: Opiton[];
  onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const Radio = (props: RadioProps) => {
  return (
    <div>
      <h3>{props.label}</h3>
      {props.options.map((option: Opiton) => (
        <span className="inline-flex items-center gap-2 mr-5" onChange={props.onChange}>
          <input
            className="rounded-md checked:ring-main-200 checked:bg-main-200 checked:text-main-200 focus:outline-main-200 focus:border-none"
            type="radio"
            name={option.title}
            value={option.value}
            checked={option.checked}
          />
          <label htmlFor={option.title}>
            <p className="">{option.description}</p>
          </label>
        </span>
      ))}
    </div>
  );
};

export default Radio;
