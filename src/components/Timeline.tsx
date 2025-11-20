import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useExperience } from '../hooks/useExperience';
import type { Experience } from '../types/type';
import { formatDate } from '../utils/date';

const TimelineSkeleton = () => (
    <div className="w-full py-8 md:py-16 min-h-screen px-4">
        <div className="container mx-auto max-w-6xl">

            <div className="h-8 md:h-12 bg-white/10 w-64 mx-auto mb-8 md:mb-16 animate-pulse"></div>

            <div className="relative hidden md:block">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-white/10 h-96"></div>
                {[1, 2, 3].map((item, index) => (
                    <div key={item} className="relative flex items-center mb-16">
                        <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'order-3 pl-8'}`}>
                            <div className="h-6 bg-white/10 w-32 animate-pulse inline-block"></div>
                        </div>

                        <div className="w-2/12 flex justify-center order-2">
                            <div className="w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
                        </div>

                        <div className={`w-5/12 ${index % 2 === 0 ? 'order-3 pl-8' : 'pr-8'}`}>
                            <div className="bg-white/20 p-6">
                                <div className="h-6 bg-white/10 rounded w-3/4 mb-2 animate-pulse"></div>
                                <div className="h-4 bg-white/10 rounded w-1/2 mb-3 animate-pulse"></div>
                                <div className="h-4 bg-white/10 rounded w-full mb-2 animate-pulse"></div>
                                <div className="h-4 bg-white/10 rounded w-5/6 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="relative md:hidden">
                <div className="absolute left-6 w-1 bg-white/10 h-96"></div>
                {[1, 2, 3].map((item) => (
                    <div key={item} className="relative flex items-start mb-8 pl-16">
                        <div className="absolute left-[26px] w-11 h-11 bg-white/10 rounded-full animate-pulse transform -translate-x-1/2"></div>
                        <div className="w-full">
                            <div className="bg-white/20 p-4">
                                <div className="h-4 bg-white/10 w-24 mb-3 animate-pulse"></div>
                                <div className="h-5 bg-white/10 w-3/4 mb-2 animate-pulse"></div>
                                <div className="h-4 bg-white/10 w-1/2 mb-2 animate-pulse"></div>
                                <div className="h-4 bg-white/10 w-full mb-1 animate-pulse"></div>
                                <div className="h-4 bg-white/10 w-5/6 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

function Timeline() {
    const { items, getAll, loading } = useExperience();
    useEffect(() => {
        getAll();
    }, []);

    if (loading) {
        return <TimelineSkeleton />;
    }

    const TimelineItem = ({ item, index }: { item: Experience; index: number }) => (
        <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="relative flex items-center mb-8 md:mb-16"
        >
            {/* Desktop Layout */}
            <div className="hidden md:contents">
                {/* Date */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'order-3 pl-8'}`}>
                    <motion.div
                        initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="inline-block"
                    >
                        <span className="text-white font-bold text-lg bg-white/10 px-4 py-2 backdrop-blur-sm border border-white/20">
                            {formatDate(item.startDate)} - {item.endDate ? formatDate(item.endDate) : 'Present'}
                        </span>
                    </motion.div>
                </div>

                {/* Icon */}
                <div className="w-2/12 flex justify-center order-2">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary shadow-xl z-10">
                        <motion.div
                            whileHover={{ scale: 1.2, rotate: 360 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Icon icon={item.icon} className='text-4xl' />
                        </motion.div>
                    </div>
                </div>

                {/* Content */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'order-3 pl-8' : 'pr-8'}`}>
                    <motion.div
                        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="bg-white/10 backdrop-blur-sm p-6 border border-white/20 hover:shadow-xl hover:border-white/30 transition-all duration-300"
                    >
                        <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                        <h4 className="text-gray-300 font-semibold mb-3">{item.company}</h4>
                        <p className="text-gray-200 leading-relaxed text-sm">{item.description}</p>
                    </motion.div>
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden w-full pl-16">
                <div className="absolute left-[26px] w-11 h-11 bg-white rounded-full flex items-center justify-center text-primary shadow-lg z-10 transform -translate-x-1/2">
                    <div className="w-6 h-6"><Icon icon={item.icon} className='text-2xl' /></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm p-4 border border-white/20"
                >
                    <span className="text-white/80 font-semibold text-xs bg-white/20 px-3 py-1">
                        {formatDate(item.startDate)} - {item.endDate ? formatDate(item.endDate) : 'Present'}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-1">{item.title}</h3>
                    <h4 className="text-gray-300 font-semibold text-sm mb-2">{item.company}</h4>
                    <p className="text-gray-200 leading-relaxed text-sm">{item.description}</p>
                </motion.div>
            </div>
        </motion.div>
    );

    return (
        <div className="w-full py-8 md:py-16 px-4">
            <div className="container mx-auto max-w-6xl">
                <motion.h2
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-2xl md:text-4xl font-bold text-center text-primary mb-8 md:mb-16 bg-white w-fit mx-auto px-6 py-2"
                >
                    My Experience
                </motion.h2>

                <div className="relative">
                    {/* Timeline Line */}
                    {items.length === 0 && (
                        <p className="text-white text-2xl text-center">No experience available.</p>
                    )}
                    {items.length > 0 && (
                        <>
                            <div className="absolute left-6 md:left-1/2 md:transform md:-translate-x-1/2 w-1 bg-white h-full"></div>
                            {items.map((item, index) => (
                                <TimelineItem key={item._id} item={item} index={index} />
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Timeline;