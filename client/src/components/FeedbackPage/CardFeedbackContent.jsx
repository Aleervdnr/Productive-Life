import React from 'react'

export default function CardFeedbackContent({ children, className = "" }) {
    return <div className={`text-sm ${className}`}>{children}</div>;
}
