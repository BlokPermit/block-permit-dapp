import React from 'react';
import ProtectedRoute from "@/components/protectedRoute/ProteectedRoute";

const Projects = () => {
    return (<ProtectedRoute>
            <div className="px-12 pt-6">
                <h1 className="text-neutral-500 text-2xl font-semibold">Projects</h1>
            </div>
        </ProtectedRoute>
    );
};

export default Projects;