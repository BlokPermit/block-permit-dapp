import Link from "next/link";
import {useRouter} from "next/router";
import React from "react";

const Route2LabelMap = {
    "/projects/addProject": "Create Project",
    "/addProject": "Create Project",
    "/projects": "Projects",
    "/projects/[id]": "Project",
    "/barrels/[barrel_id]/settings": "Settings",
};

export function BreadCrumbs() {
    const router = useRouter();

    const [crumbs, setCrumbs] = React.useState([]);

    React.useEffect(() => {
        const segmentsPath = router.asPath.split("/");
        const segmentsRoute = router.route.split("/");

        const crumbLinks = CombineAccumulatively(segmentsPath);
        const crumbLabels = CombineAccumulatively(segmentsRoute);

        const crumbs = crumbLinks.map((link: any, index: any) => {
            const route = crumbLabels[index];
            return {
                link: link,
                route: route,
                // @ts-ignore
                label: Route2LabelMap[route] || route,
            };
        });
        if (crumbs.length > 3) {
            crumbs.splice(0, 1);
        }
        setCrumbs(crumbs);
    }, [router.route]);

    return (
        <div className="w-full flex justify-center items-center gap-1 py-5 ">
            <div className=" bg-neutral-100 items-center flex px-5 rounded-xl py-2">
                {crumbs.map((crumb: any, index) => {
                    return (
                        <div className="flex items-center " key={index}>
                            {(index > 0) ? <div className="text-neutral-400 px-4 text-xs">{'>'}</div> : null}

                            <Link href={crumb.link}
                                  className={`hover:text-neutral-600 align-bottom pt-0.5  ${router.pathname == crumb.link ? 'text-main-200' : ''}`}>
                                {crumb.label}
                            </Link>

                        </div>
                    );
                })}
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