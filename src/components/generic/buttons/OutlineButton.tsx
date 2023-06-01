import React from 'react';
import Link from "next/link";

interface OutlineButtonProps {
    onClick?: () => void;
    text: string;
    type?: "button" | "submit" | "reset" | undefined;
    isLink?: boolean;
    href?: string | object;
    disabled?: boolean;
}

const OutlineButton = (props: OutlineButtonProps) => {
    const {isLink = false, href} = props;
    if (isLink) {
        return (
            // @ts-ignore
            <Link href={href}
                  className="inline-block rounded-3xl border border-main-400 px-12 py-3 text-sm font-medium text-main-400 hover:bg-main-400 hover:text-white focus:outline-none focus:ring active:bg-main-300"
            >
                {props.text}
            </Link>
        );
    }
    return (
        <button
            type={props.type}
            className={`inline-block border ${props.disabled == true ? 'border-grey rounded-3xl text-neutral-400 ' : 'border-main-400 rounded-3xl text-main-400 hover:bg-main-400 hover:text-white'}  px-12 py-3 text-sm font-medium  focus:outline-none focus:ring active:bg-main-300`}
            onClick={props.onClick}
            disabled={props.disabled}
        >
            {props.text}
        </button>
    );
};

export default OutlineButton;