import { Icon } from "@iconify/react"
import type { Project } from "../types/type"
import { motion } from "framer-motion"
import { useState } from "react"

function ProjectCard({ project }: { project: Project }) {
    const [imgLoaded, setImgLoaded] = useState(false)
    const [imgError, setImgError] = useState(false)
    return (
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="overflow-hidden"
        >
            <a href={project.linkUrl}
                key={project._id}
                target="_blank"
                className="flex flex-col bg-white/10 max-w-100 backdrop-blur-xs hover:bg-white/20 hover:scale-98 transition-all duration-300 overflow-hidden">
                <header className="w-full h-50">
                    {!imgLoaded && !imgError && (
                        <div className="absolute inset-0 bg-gray-300 animate-pulse rounded" />
                    )}
                    <img
                        src={project.imageSrc}
                        alt="image"
                        className={`w-full h-50 object-cover transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
                        onLoad={() => setImgLoaded(true)}
                        onError={() => setImgError(true)}
                    />
                    {imgError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500">
                            Gambar gagal dimuat
                        </div>
                    )}
                </header>
                <div className="p-4 space-y-1 text-white">
                    <div className="flex gap-2">
                        {project.techIcons.map((icon, index) => (
                            <Icon key={index} icon={icon.src} className="text-xl" />
                        ))}
                    </div>
                    <div className="flex justify-between items-center">
                        <h2 className="text-white text-2xl">{project.title}</h2>
                        <Icon icon={project.linkIcon} className="text-2xl" />
                    </div>
                    <p className="text-sm">{project.description}</p>
                </div>
            </a>
        </motion.div>
    )
}

export default ProjectCard