import React from 'react';
import ProtectedRoute from "@/components/protectedRoute/ProtectedRoute";

const Documents = () => {
    return (<ProtectedRoute>
            <div className="px-12 pt-6">
                <h1 className="text-neutral-500 text-2xl font-semibold">Documents</h1>
            </div>
        </ProtectedRoute>
    );
};

export default Documents;