import PublicLayout from "../../layouts/PublicLayout"
import ProjectCard from "../../components/ProjectCard"

export default function Project() {
    return (
        <PublicLayout
            title="Projects"
            icon="pixel:code-solid"
        >

            {/* Card */}
            <div className="mt-10 flex flex-wrap w-full items-center justify-center gap-8">
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
            </div>
        </PublicLayout>
    )
}
