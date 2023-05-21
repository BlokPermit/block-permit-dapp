import React from 'react';
import Link from "next/link";

interface OutlineButtonProps {
    onClick?: () => void;
    text: string;
    type?: "button" | "submit" | "reset" | undefined;
    isLink?: boolean;
    href?: string | object;
}

const OutlineButton = (props: OutlineButtonProps) => {
    const {isLink = false, href} = props;
    if (isLink) {
        return (
            // @ts-ignore
            <Link href={href}
                  className="inline-block  rounded-3xl border border-sky-400 px-12 py-3 text-sm font-medium text-indigo-400 hover:bg-sky-400 hover:text-white focus:outline-none focus:ring active:bg-sky-300"
            >
                {props.text}
            </Link>
        );
    }
    return (
        <button
            type={props.type}
            className="inline-block rounded border border-sky-400 px-12 py-3 text-sm font-medium text-indigo-400 hover:bg-sky-400 hover:text-white focus:outline-none focus:ring active:bg-sky-300"
            onClick={props.onClick}
        >
            {props.text}
        </button>
    );
};

export default OutlineButton;