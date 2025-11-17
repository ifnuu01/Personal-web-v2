import CertifCard from "../../components/CertifCard";
import PublicLayout from "../../layouts/PublicLayout";

export default function Achivement() {
    return (
        <PublicLayout title="Achivement" icon="pixel:trophy">
            <div className="mt-10 flex flex-wrap w-full items-center justify-center gap-8">
                <CertifCard />
                <CertifCard />
                <CertifCard />
                <CertifCard />
            </div>
        </PublicLayout>
    )
}
