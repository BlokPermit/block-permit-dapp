import {useRouter} from "next/router";
import React, { useEffect, useState } from "react";
import Link from 'next/link';

const Route2LabelMap = {
    "projects": "Projects",
    "addProject": "Create Project",
    "editProject": "Edit Project",
};

interface Crumb {
    link: string;
    label: string;
}

export function BreadCrumbs() {
    const router = useRouter();

    const [crumbs, setCrumbs] = useState<Crumb[]>([]);

    useEffect(() => {
        const pathSegments = router.asPath.split("/").filter(segment => segment);

        const crumbs: Crumb[] = pathSegments.map((segment, index, array) => {
            const link = '/' + array.slice(0, index + 1).join('/');
            const label = Route2LabelMap[segment] || segment;

            return { link, label };
        });

        setCrumbs(crumbs);
    }, [router.asPath]);

    return (
        <div className="w-full flex justify-center items-center gap-1 py-5 ">
            <div className="bg-neutral-100 items-center flex px-5 rounded-xl py-2">
                {crumbs.map((crumb, index) => (
                    <div className="flex items-center" key={index}>
                        {index > 0 && <div className="text-neutral-400 px-4 text-xs">{'>'}</div>}
                        <Link href={crumb.link} className={`hover:text-neutral-600 align-bottom pt-0.5  ${router.asPath === crumb.link ? 'text-main-200' : ''}`}>
                                {crumb.label}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}


function CombineAccumulatively(segments: any) {
    // @ts-ignore
    return segments.reduce((acc, cur, curIndex) => {
        const last = curIndex > 1 ? acc[curIndex - 1] : "";
        const newPath = last + "/" + cur;
        acc.push(newPath);
        return acc;
    }, []);
}