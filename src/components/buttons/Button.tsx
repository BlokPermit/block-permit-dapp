import React from 'react';

interface ButtonProps {
    onClick?: () => void;
    text: string;
}

const Button = (props: ButtonProps) => {
    return (
        <button
            className="inline-block rounded border border-sky-400 bg-sky-400 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-sky-400 focus:outline-none focus:ring active:text-sky-400"
            onClick={props.onClick}
        >
            {props.text}
        </button>
    );
};

export default Button;