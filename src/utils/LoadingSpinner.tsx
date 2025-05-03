import React from "react";

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center h-full w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
    </div>
);

export { LoadingSpinner };
