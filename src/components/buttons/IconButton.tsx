import React from 'react';

interface IconButtonProps {
    onClick?: () => void;
    text: string;
}

const IconButton = (props: IconButtonProps) => {
    return (
        <button
            className="inline-flex items-center gap-2 rounded border border-sky-400 bg-sky-400 px-8 py-3 text-white hover:bg-transparent hover:text-sky-400 focus:outline-none focus:ring active:text-sky-300"
            onClick={props.onClick}
        >
            <span className="text-sm font-medium"> {props.text} </span>

            <svg
                className="h-5 w-5 rtl:rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
            </svg>
        </button>
    );
};

export default IconButton;