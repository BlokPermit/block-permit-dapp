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
                  className="inline-block rounded border border-sky-400 bg-sky-400 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-sky-400 focus:outline-none focus:ring active:text-sky-400"
            >
                {props.text}
            </Link>
        );
    }
    return (
        <button
            type={props.type}
            className="inline-block rounded border border-sky-400 bg-sky-400 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-sky-400 focus:outline-none focus:ring active:text-sky-400"
            onClick={props.onClick}
        >
            {props.text}
        </button>
    );
};

export default Button;