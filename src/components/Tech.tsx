import { useEffect } from "react"
import { useTech } from "../hooks/useTech"
import { Icon } from "@iconify/react"
import { motion } from "framer-motion"

const TechSkeleton = () => {
    return (
        <>
            <div className="text-2xl md:text-4xl font-bold text-centermb-8 md:mb-16 bg-white/10 w-fit mx-auto px-6 py-2 animate-pulse">
                <div className="w-40 py-2 bg-white/20"></div>
            </div>

            <div className="bg-white/10 p-4 text-white animate-pulse">
                <div className="w-8 h-8 bg-white/20"></div>
            </div>
        </>
    )
}

function Tech() {
    const { items, getAll, loading } = useTech()

    useEffect(() => {
        getAll()
    }, [])

    if (loading) {
        return <TechSkeleton />
    }

    return (
        <div>
            <div className="text-2xl md:text-4xl font-bold text-center text-primary mb-8 md:mb-16 bg-white w-fit mx-auto px-6 py-2">
                <h1>Tech Stack <br /> I Use</h1>
            </div>
            {/* Content */}
            <div className="flex flex-wrap gap-4 justify-center items-center">
                {items.length === 0 && (
                    <p className="text-white text-2xl">No tech stack available.</p>
                )}
                {items.length > 0 && items.map((tech, index) => (
                    <motion.div
                        key={index}
                        className="bg-white/10 p-4 text-white backdrop-blur-xs"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        viewport={{
                            once: true,
                            amount: 0.2
                        }}
                        whileHover={{
                            rotate: 10,
                            scale: 1.15,
                            transition: {
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                                duration: 0.2
                            }
                        }}
                    >
                        <Icon icon={tech.icon} className="text-2xl" />
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default Tech