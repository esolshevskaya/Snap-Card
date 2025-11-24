import React from "react";

interface CheckIconProps {
    className?: string;
    onClick?: (e: React.MouseEvent) => void;
}

const CheckIcon: React.FC<CheckIconProps> = ({ className, onClick }) => (
    <svg
        className={className}
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        onClick={onClick}
        style={{ cursor: 'pointer' }}
    >
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

export default CheckIcon;