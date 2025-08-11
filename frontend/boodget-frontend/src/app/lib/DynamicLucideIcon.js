import dynamic from "next/dynamic";
import { useMemo } from "react";

const DynamicLucideIcon = ({ name, className }) => {
    const LucideIcon = useMemo(
        () =>
            dynamic(() =>
                    import("lucide-react").then((mod) => mod[name] || (() => null)),
                { ssr: false }
            ),
        [name] // only recreate if `name` changes
    );

    return <LucideIcon className={className} />;
};

export default DynamicLucideIcon;
