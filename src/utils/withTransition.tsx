import { motion } from 'framer-motion';

const containerVariants = {
    initial: {
        transition: {
            staggerChildren: 0.09,
            staggerDirection: 1,
        },
    },
    animate: {
        transition: {
            delayChildren: 0.2,
            staggerChildren: 0.09,
            staggerDirection: -1,
        },
    },
    exit: {
        transition: {
            staggerChildren: 0.09,
            staggerDirection: 1,
        },
    },
};

const panelVariants = {

    initial: { y: '0%' },
    exit: { y: '0%' },
    animate: {
        y: '100%',
        transition: { duration: 0.7, ease: [0.6, 0.01, -0.05, 0.95] as const }
    },
};

const withTransition = (OriginalComponent: React.ComponentType) => {
    return () => (
        <>
            <OriginalComponent />
            <motion.div
                className="fixed top-0 left-0 w-full h-full flex z-50"
                style={{ pointerEvents: 'none' }}
                variants={containerVariants}
                initial="initial"
                animate="animate"
                exit="exit"
            >
                <motion.div
                    className="relative w-1/1 h-full bg-secondary flex flex-col items-center justify-center"
                    style={{ pointerEvents: 'auto' }}
                    variants={panelVariants}
                >
                    <img src="/Rocket.svg" alt="Rocket" className='w-50' />
                    <h1 className='text-white text-2xl'>Sheesh</h1>
                </motion.div>
            </motion.div>
        </>
    );
};

export default withTransition;