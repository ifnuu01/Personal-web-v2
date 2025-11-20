import PublicLayout from "../../layouts/PublicLayout"
import ProjectCard from "../../components/ProjectCard"
import { useEffect, useState } from "react";
import { useProject } from "../../hooks/useProject";
import Button from "../../components/Button";
import { useCategory } from "../../hooks/useCategory";

const ProjectSkeleton = () => {
    return (
        <>
            <div className="flex flex-col bg-white/10 w-100 backdrop-blur-xs hover:bg-white/20 hover:scale-98 transition-all duration-300 overflow-hidden animate-pulse">
                <header className="w-full h-50 bg-white/20 animate-pulse"></header>
                <div className="mt-4 p-4 space-y-1 text-white/10 animate-pulse">
                    <div className="flex gap-2">
                        <div className="h-6 w-1/4 bg-white/20"></div>
                        <div className="h-6 w-1/4 bg-white/20"></div>
                    </div>
                    <div className="h-6 w-3/4 bg-white/20"></div>
                    <div className="h-4 w-1/2 bg-white/20"></div>
                </div>
            </div>
            <div className="flex flex-col bg-white/10 w-100 backdrop-blur-xs hover:bg-white/20 hover:scale-98 transition-all duration-300 overflow-hidden animate-pulse">
                <header className="w-full h-50 bg-white/20 animate-pulse"></header>
                <div className="mt-4 p-4 space-y-1 text-white/10 animate-pulse">
                    <div className="flex gap-2">
                        <div className="h-6 w-1/4 bg-white/20"></div>
                        <div className="h-6 w-1/4 bg-white/20"></div>
                    </div>
                    <div className="h-6 w-3/4 bg-white/20"></div>
                    <div className="h-4 w-1/2 bg-white/20"></div>
                </div>
            </div>
            <div className="flex flex-col bg-white/10 w-100 backdrop-blur-xs hover:bg-white/20 hover:scale-98 transition-all duration-300 overflow-hidden animate-pulse">
                <header className="w-full h-50 bg-white/20 animate-pulse"></header>
                <div className="mt-4 p-4 space-y-1 text-white/10 animate-pulse">
                    <div className="flex gap-2">
                        <div className="h-6 w-1/4 bg-white/20"></div>
                        <div className="h-6 w-1/4 bg-white/20"></div>
                    </div>
                    <div className="h-6 w-3/4 bg-white/20"></div>
                    <div className="h-4 w-1/2 bg-white/20"></div>
                </div>
            </div>
        </>
    )
}

export default function Project() {
    const { items, getAll, loading } = useProject()
    const { items: categoryItem, getAll: getAllCategory, loading: categoryLoading } = useCategory()
    const [activeCategory, setActiveCategory] = useState("All");

    useEffect(() => {
        getAll()
        getAllCategory()
    }, []);

    const filteredProjects = activeCategory === "All"
        ? items
        : items.filter(project => project.category.name === activeCategory);

    return (
        <PublicLayout
            title="Projects"
            icon="pixel:code-solid"
        >

            {/* Filtering */}
            {categoryLoading ? (
                <div className="w-full mt-4 flex items-center justify-center flex-wrap gap-4">
                    <div className="bg-white/10 p-4 text-white animate-pulse"></div>
                </div>
            ) : (
                <div className="w-full mt-4 flex items-center justify-center flex-wrap gap-4">
                    <Button onClick={() => setActiveCategory("All")}
                        bg={activeCategory === "All" ? "bg-white" : "bg-white/10"}
                        color={activeCategory === "All" ? "text-primary" : "text-white"}
                    >
                        All
                    </Button>
                    {categoryItem.length > 0 && categoryItem.map((category) => (
                        <Button
                            onClick={() => setActiveCategory(category.name)}
                            key={category._id}
                            bg={activeCategory === category.name ? "bg-white" : "bg-white/10"}
                            color={activeCategory === category.name ? "text-primary" : "text-white"}
                        >
                            {category.name}
                        </Button>
                    ))}
                </div>
            )}

            {/* Card */}
            <div className="mt-10 flex flex-wrap w-full items-center justify-center gap-4 md:gap-8 px-4 md:px-0 overflow-hidden">
                {loading && <ProjectSkeleton />}
                {!loading && filteredProjects.length === 0 && (
                    <p className="text-white text-2xl">No projects available.</p>
                )}
                {!loading && filteredProjects.length > 0 && filteredProjects.map((project, index) => (
                    <ProjectCard
                        key={index}
                        project={project}
                    />
                ))}
            </div>
        </PublicLayout>
    )
}
