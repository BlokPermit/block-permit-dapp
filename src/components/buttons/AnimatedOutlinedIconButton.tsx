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

const AnimatedOutlinedIconButton = (props: OutlineIconButtonProps) => {
    const {isLink = false, href} = props;

    if (isLink) {
        return (
            // @ts-ignore
            <Link href={href}
                  className="group relative inline-flex items-center overflow-hidden rounded border border-current px-8 py-3 text-sky-400 focus:outline-none focus:ring active:text-sky-300"
            >
         <span className="absolute -end-full transition-all group-hover:end-4">
    {props.icon}
  </span>

                <span className="text-sm font-medium transition-all group-hover:me-4">
    {props.text}
  </span>

            </Link>
        );
    }

    return (
        <button
            type={props.type}
            className="group relative inline-flex items-center overflow-hidden rounded border border-current px-8 py-3 text-sky-400 focus:outline-none focus:ring active:text-sky-300"
            onClick={props.onClick}
        >
  <span className="absolute -end-full transition-all group-hover:end-4">
    {props.icon}
  </span>

            <span className="text-sm font-medium transition-all group-hover:me-4">
    {props.text}
  </span>
        </button>
    );
};

export default AnimatedOutlinedIconButton;