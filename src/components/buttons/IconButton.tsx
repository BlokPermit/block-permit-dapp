import React, {ReactNode} from 'react';
import Link from "next/link";

interface IconButtonProps {
    onClick?: () => void;
    text: string;
    type?: "button" | "submit" | "reset" | undefined;
    icon: ReactNode;
    isLink?: boolean;
    href?: string | object;
}

const IconButton = (props: IconButtonProps) => {
    const {isLink = false, href} = props;
    if (isLink) {
        return (
            // @ts-ignore
            <Link href={href}
                  className="inline-flex items-center gap-2 rounded border border-sky-400 bg-sky-400 px-8 py-3 text-white hover:bg-transparent hover:text-sky-400 focus:outline-none focus:ring active:text-sky-300"
            >
                <span className="text-sm font-medium"> {props.text} </span>

                {props.icon}

            </Link>
        );
    }
    return (
        <button
            type={props.type}
            className="inline-flex items-center gap-2 rounded border border-sky-400 bg-sky-400 px-8 py-3 text-white hover:bg-transparent hover:text-sky-400 focus:outline-none focus:ring active:text-sky-300"
            onClick={props.onClick}
        >
            <span className="text-sm font-medium"> {props.text} </span>

            {props.icon}
        </button>
    );
};

export default IconButton;