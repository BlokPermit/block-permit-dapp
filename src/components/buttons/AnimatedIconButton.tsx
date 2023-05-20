import React from 'react';

interface OutlineIconButtonProps {
    onClick?: () => void;
    text: string;
}

const AnimatedIconButton = (props: OutlineIconButtonProps) => {
    return (
        <button
            className="group relative inline-flex items-center overflow-hidden rounded bg-sky-400 px-8 py-3 text-white focus:outline-none focus:ring active:bg-sky-300"
            onClick={props.onClick}
        >
  <span className="absolute -end-full transition-all group-hover:end-4">
    <svg
        className="h-5 w-5 rtl:rotate-180"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
      <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M17 8l4 4m0 0l-4 4m4-4H3"
      />
    </svg>
  </span>

            <span className="text-sm font-medium transition-all group-hover:me-4">
    {props.text}
  </span>
        </button>
    );
};

export default AnimatedIconButton;