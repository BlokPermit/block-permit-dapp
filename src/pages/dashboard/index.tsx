import React from 'react';
import DocumentPlaceholder from "@/components/placeholders/DocumentPlaceholder";
import ProjectPlaceholder from "@/components/placeholders/ProjectPlaceholder";
import ProtectedRoute from "@/components/protected-route/ProtectedRoute";

const Dashboard = () => {
    return (<ProtectedRoute>
        <div className="px-12 pt-6">
            <div className="mt-2">
                <h1 className="text-neutral-500 text-2xl font-semibold">Recent projects</h1>
                <div className="flex flex-wrap mt-3">
                    {Array.from({length: 3,}).map((value, index: number) => (
                        <ProjectPlaceholder myKey={index}/>
                    ))}</div>
            </div>
            <div className="mt-10">
                <div className="flex items-center">
                    <h1 className="text-neutral-500 text-2xl font-semibold mr-3">Awaiting approval</h1><span
                    className="inline-flex items-center justify-center rounded-full bg-amber-100 px-2.5 py-0.5 text-amber-700  h-1/4 mt-0.5"
                >
            <p className="whitespace-nowrap text-sm">1 new project</p>
            </span>
                </div>
                <div className="flex flex-wrap mt-3">
                    {Array.from({length: 5}).map((value, index) => (
                        <ProjectPlaceholder myKey={index}/>
                    ))}</div>
            </div>
            <div className="mt-10">
                <h1 className="text-neutral-500 text-2xl font-semibold mt-10">Recent document</h1>
                <div className="flex flex-wrap mt-3">
                    {Array.from({length: 3}).map((value, index) => (
                        <DocumentPlaceholder myKey={index}/>
                    ))}</div>
            </div>

        </div>
    </ProtectedRoute>);
};


export default Dashboard;