import React from 'react';
import Link from "next/link";

interface ButtonProps {
    onClick?: () => void;
    text: string;
    type?: "button" | "submit" | "reset" | undefined;
    isLink?: boolean;
    href?: string | object;
}

const Button = (props: ButtonProps) => {
    const {isLink = false, href} = props;

    if (isLink) {
        return (
            // @ts-ignore
            <Link href={href}
                  className="inline-block  rounded-3xl border border-main-400 bg-main-400 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-main-400 focus:outline-none focus:ring active:text-main-400"
            >
                {props.text}
            </Link>
        );
    }
    return (
        <button
            type={props.type}
            className="inline-block rounded border border-main-400 bg-main-400 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-main-400 focus:outline-none focus:ring active:text-main-400"
            onClick={props.onClick}
        >
            {props.text}
        </button>
    );
};

export default Button;