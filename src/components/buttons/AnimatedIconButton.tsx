import Link from "next/link";
import {ReactNode} from "react";

interface OutlineIconButtonProps {
    onClick?: () => void;
    text: string;
    type?: "button" | "submit" | "reset" | undefined;
    icon: ReactNode;
    isLink?: boolean;
    href?: string | object;
}

const AnimatedIconButton = (props: OutlineIconButtonProps) => {
    const {isLink = false, href} = props;

    if (isLink) {
        return (
            // @ts-ignore
            <Link href={href}

                  className="group relative inline-flex items-center overflow-hidden rounded bg-sky-400 px-8 py-3 text-white focus:outline-none focus:ring active:bg-sky-300"
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
            className="group relative inline-flex items-center overflow-hidden rounded bg-sky-400 px-8 py-3 text-white focus:outline-none focus:ring active:bg-sky-300"
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

export default AnimatedIconButton;