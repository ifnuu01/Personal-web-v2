import type { Certificate } from "../types/type";
import Modal from "./Modal"
import { useState } from "react"

function CertifCard({ certif }: { certif: Certificate }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);
    const [imgError, setImgError] = useState(false);

    return (
        <>
            <div
                onClick={() => setIsModalOpen(true)}
                key={certif._id}
                className="bg-white/10 w-96 backdrop-blur-sm border cursor-pointer border-white/10 hover:bg-white/20 hover:scale-95 transition-all px-4 py-2"
            >
                <h2 className="text-white">{certif.institution}</h2>
                <p className="text-white text-3xl">{certif.title}</p>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Certificate Details"
            >
                <div className="space-y-4">
                    {!imgLoaded && !imgError && (
                        <div className="absolute inset-0 bg-gray-300 animate-pulse" />
                    )}
                    <img
                        src={certif.imageUrl}
                        alt={certif.title}
                        width={'100%'}
                        className={`w-full max-h-[80vh] object-contain transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
                        onLoad={() => setImgLoaded(true)}
                        onError={() => setImgError(true)}
                    />
                    {imgError && (
                        <div className="w-full h-80 flex items-center justify-center bg-gray-200 text-gray-500">
                            Gambar gagal dimuat
                        </div>
                    )}
                    <p className="text-white">
                        {certif.description}
                    </p>
                    <a
                        className="block bg-blue-400/20 text-blue-500 p-4 font-bold text-center hover:bg-white hover:text-primary transition-colors"
                        href={certif.link} target="_blank" rel="noopener noreferrer">
                        Visit
                    </a>
                </div>
            </Modal>
        </>
    )
}

export default CertifCard