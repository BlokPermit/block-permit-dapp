import React from 'react';

interface OutlineButtonProps {
    onClick?: () => void;
    text: string;
}

const OutlineButton = (props: OutlineButtonProps) => {
    return (
        <button
            className="inline-block rounded border border-sky-400 px-12 py-3 text-sm font-medium text-indigo-400 hover:bg-sky-400 hover:text-white focus:outline-none focus:ring active:bg-sky-300"
            onClick={props.onClick}
        >
            {props.text}
        </button>
    );
};

export default OutlineButton;