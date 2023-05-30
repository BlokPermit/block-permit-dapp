import React, {ReactNode} from 'react';
import Link from "next/link";

interface OutlineIconButtonProps {
    onClick?: () => void;
    text: string;
    type?: "button" | "submit" | "reset" | undefined;
    icon: ReactNode;
    isLink?: boolean;
    href?: string | object;
}

const OutlineIconButton = (props: OutlineIconButtonProps) => {
    const {isLink = false, href} = props;
    if (isLink) {
        return (
            // @ts-ignore
            <Link href={href}
                  className="inline-flex items-center gap-2 rounded-3xl border border-sky-400 px-8 py-3 text-sky-400 hover:bg-sky-400 hover:text-white focus:outline-none focus:ring active:bg-sky-300"
            >
                <span className="text-sm font-medium"> {props.text} </span>
                {props.icon}
            </Link>
        );
    }

    return (
        <button
            type={props.type}
            className="inline-flex items-center gap-2 rounded border border-sky-400 px-8 py-3 text-sky-400 hover:bg-sky-400 hover:text-white focus:outline-none focus:ring active:bg-sky-300"
            onClick={props.onClick}
        >
            <span className="text-sm font-medium"> {props.text} </span>
            {props.icon}
        </button>
    );
};

export default OutlineIconButton;