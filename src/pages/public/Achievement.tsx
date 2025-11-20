import { useEffect } from "react";
import CertifCard from "../../components/CertifCard";
import { useCertificate } from "../../hooks/useCertificate";
import PublicLayout from "../../layouts/PublicLayout";

const CertifSkeleton = () => {
    return (
        <>
            <div className="bg-white/10 w-96 h-32 backdrop-blur-sm border cursor-pointer border-white/10 hover:bg-white/20 hover:scale-95 transition-all px-4 py-2 animate-pulse">
                <div className="w-32 h-6 bg-white/20 mt-4"></div>
            </div>
            <div className="bg-white/10 w-96 h-32 backdrop-blur-sm border cursor-pointer border-white/10 hover:bg-white/20 hover:scale-95 transition-all px-4 py-2 animate-pulse">
                <div className="w-32 h-6 bg-white/20 mt-4"></div>
            </div>
            <div className="bg-white/10 w-96 h-32 backdrop-blur-sm border cursor-pointer border-white/10 hover:bg-white/20 hover:scale-95 transition-all px-4 py-2 animate-pulse">
                <div className="w-32 h-6 bg-white/20 mt-4"></div>
            </div>
        </>
    )
}

export default function Achievement() {
    const { items, getAll, loading } = useCertificate();
    useEffect(() => {
        getAll();
    }, []);

    return (
        <PublicLayout title="Achievement" icon="streamline-pixel:social-rewards-certified-diploma">
            <div className="mt-10 flex flex-wrap w-full items-center justify-center gap-8">
                {loading && <CertifSkeleton />}
                {!loading && items.length === 0 && (
                    <p className="text-white text-2xl">No certificates available.</p>
                )}
                {!loading && items.length > 0 && items.map((certif, index) => (
                    <CertifCard
                        key={index}
                        certif={certif}
                    />
                ))}
            </div>
        </PublicLayout>
    )
}
