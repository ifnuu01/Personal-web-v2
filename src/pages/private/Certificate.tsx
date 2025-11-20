import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import PrivateLayout from "../../layouts/PrivateLayout";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Modal from "../../components/Modal";
import Table from "../../components/Table";
import { useCertificate } from "../../hooks/useCertificate";
import apiClient from "../../hooks/apiClient";
import type { Certificate } from "../../types/type";
import ImageUpload from "../../components/ImageUpload";
import Textarea from "../../components/Textarea";

interface CertificateForm extends Record<string, unknown> {
    title: string;
    description: string;
    link: string;
    institution: string;
}

export default function Certificate() {
    const { items, loading, error, getAll, remove } = useCertificate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
    const [deletingCertificate, setDeletingCertificate] = useState<Certificate | null>(null);
    const [formData, setFormData] = useState<CertificateForm>({
        title: "",
        description: "",
        link: "",
        institution: ""
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        getAll();
    }, []);

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            link: "",
            institution: ""
        });
        setSelectedFile(null);
        setFormErrors({});
        setEditingCertificate(null);
    };


    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetForm();
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));


        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: "" }));
        }
    };


    const handleFileChange = (file: File | null) => {
        setSelectedFile(file);
        if (formErrors.image) {
            setFormErrors(prev => ({ ...prev, image: "" }));
        }
    };


    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!selectedFile && !editingCertificate) {
            errors.image = "Certificate image is required";
        }

        if (!formData.title.trim()) {
            errors.title = "Certificate title is required";
        }

        if (!formData.description.trim()) {
            errors.description = "Certificate description is required";
        }

        if (!formData.institution.trim()) {
            errors.institution = "Certificate institution is required";
        }

        if (!formData.link.trim()) {
            errors.link = "Certificate link is required";
        } else if (!isValidUrl(formData.link)) {
            errors.link = "Please enter a valid URL";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const isValidUrl = (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };


    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const formDataToSend = new FormData();


            if (selectedFile) {
                formDataToSend.append('image', selectedFile);
            }


            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('link', formData.link);
            formDataToSend.append('institution', formData.institution);

            let response;
            if (editingCertificate) {

                response = await apiClient.put(`certificates/${editingCertificate._id}`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {

                response = await apiClient.post('certificates', formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            if (response.data.message) {
                setSuccessMessage(response.data.message);
                setTimeout(() => setSuccessMessage(""), 3000);
            }

            handleCloseModal();
            getAll();
        } catch (error) {
            console.error('Error saving certificate:', error);
            setFormErrors({ submit: 'Failed to save certificate. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleEdit = async (certificate: Certificate) => {
        setEditingCertificate(certificate);
        setFormData({
            title: certificate.title,
            description: certificate.description,
            link: certificate.link,
            institution: certificate.institution
        });
        setSelectedFile(null);
        setIsModalOpen(true);
    };


    const handleDeleteConfirm = (certificate: Certificate) => {
        setDeletingCertificate(certificate);
        setIsDeleteModalOpen(true);
    };


    const handleDelete = async () => {
        if (!deletingCertificate) return;

        try {
            const message = await remove(deletingCertificate._id);
            if (message) {
                setSuccessMessage(message);
                setTimeout(() => setSuccessMessage(""), 3000);
            }

            setIsDeleteModalOpen(false);
            setDeletingCertificate(null);
            getAll();
        } catch {
            console.log("Deletion failed");
        }
    };


    const columns = [
        {
            key: "imageUrl",
            label: "Certificate",
            render: (value: unknown, row: Certificate) => (
                <div className="flex items-center gap-4">
                    <img
                        src={String(value)}
                        alt={row.title}
                        className="w-16 h-16 object-cover border border-white/20"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNOSAxMmwyIDIgNC00bTYgMmE5IDkgMCAxMS0xOCAwIDkgOSAwIDAxMTggMHoiLz48L3N2Zz4=';
                        }}
                    />
                    <div>
                        <p className="font-medium text-white">{row.title}</p>
                        <p className="text-sm text-white/60 line-clamp-1">{row.description}</p>
                    </div>
                </div>
            )
        },
        {
            key: "link",
            label: "Link",
            render: (value: unknown) => (
                <Button
                    onClick={() => window.open(String(value), '_blank')}
                    bg="bg-blue-500/20"
                    color="text-blue-400"
                >
                    <Icon icon="material-symbols:open-in-new" />
                    Visit
                </Button>
            )
        },
        {
            key: "createdAt",
            label: "Added On",
            render: (value: unknown) => {
                if (typeof value === 'string') {
                    return new Date(value).toLocaleDateString();
                }
                return String(value || '');
            }
        },
        {
            key: "actions",
            label: "Actions",
            render: (_: unknown, row: Certificate) => (
                <div className="flex gap-2">
                    <div onClick={() => handleEdit(row)}>
                        <Button bg="bg-blue-500/20" color="text-blue-400">
                            <Icon icon="material-symbols:edit-outline" />
                        </Button>
                    </div>
                    <div onClick={() => handleDeleteConfirm(row)}>
                        <Button bg="bg-red-500/20" color="text-red-400">
                            <Icon icon="material-symbols:delete-outline" />
                        </Button>
                    </div>
                </div>
            )
        }
    ];

    return (
        <PrivateLayout>
            <div className="pt-6 px-0">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Certificate Management</h1>
                        <p className="text-white/60">Manage your certificates and achievements</p>
                    </div>
                    <div onClick={() => setIsModalOpen(true)}>
                        <Button bg="bg-green-500/20" color="text-green-400" className="font-bold">
                            <Icon icon="material-symbols:add" />
                            Add Certificate
                        </Button>
                    </div>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 ">
                        <p className="text-green-400">{successMessage}</p>
                    </div>
                )}

                {/* Error Messages */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 ">
                        {typeof error === 'object' && error !== null ? (
                            Object.entries(error).map(([field, messages]) => (
                                <p key={field} className="text-red-400">
                                    {Array.isArray(messages) ? messages.join(', ') : messages}
                                </p>
                            ))
                        ) : (
                            <p className="text-red-400">An error occurred</p>
                        )}
                    </div>
                )}

                {/* Form Submit Errors */}
                {formErrors.submit && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 ">
                        <p className="text-red-400">{formErrors.submit}</p>
                    </div>
                )}

                {/* Table */}
                <Table<Certificate>
                    columns={columns}
                    data={items}
                    loading={loading}
                />

                {/* Create/Edit Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={editingCertificate ? "Edit Certificate" : "Add Certificate"}
                    className="max-w-3xl"
                >
                    <div className="flex flex-col gap-6">
                        {/* Image Upload */}
                        <ImageUpload
                            label="Certificate Image"
                            onFileChange={handleFileChange}
                            error={formErrors.image}
                            required
                            existingImageUrl={editingCertificate?.imageUrl}
                        />

                        {/* Certificate Details */}
                        <div className="grid grid-cols-1 gap-4">
                            <Input
                                label="Certificate Title"
                                type="text"
                                placeholder="e.g. AWS Solutions Architect Associate"
                                value={formData.title}
                                onChange={handleInputChange}
                                name="title"
                                id="title"
                                error={formErrors.title}
                                required
                            />

                            <Input
                                label="Institution"
                                type="text"
                                placeholder="e.g. Coursera, Udemy, etc."
                                value={formData.institution}
                                onChange={handleInputChange}
                                name="institution"
                                id="institution"
                                error={formErrors.institution}
                                required
                            />

                            <Textarea
                                label="Description"
                                placeholder="Describe what this certificate represents and its significance..."
                                value={formData.description}
                                onChange={handleInputChange}
                                name="description"
                                id="description"
                                error={formErrors.description}
                                required
                                rows={3}
                            />

                            <Input
                                label="Certificate Link"
                                type="url"
                                placeholder="https://www.credly.com/badges/..."
                                value={formData.link}
                                onChange={handleInputChange}
                                name="link"
                                id="link"
                                error={formErrors.link}
                                required
                            />
                        </div>

                        <div className="flex gap-2 justify-end mt-4">
                            <div onClick={handleCloseModal}>
                                <Button bg="bg-gray-500/20" color="text-gray-400">
                                    Cancel
                                </Button>
                            </div>
                            <div onClick={handleSubmit}>
                                <Button
                                    bg="bg-green-500/20"
                                    color="text-green-400"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Saving..." : (editingCertificate ? "Update" : "Create")}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Modal>

                {/* Delete Confirmation Modal */}
                <Modal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setDeletingCertificate(null);
                    }}
                    title="Delete Certificate"
                >
                    <div className="flex flex-col gap-4">
                        {deletingCertificate && (
                            <div className="flex items-center gap-4 p-4 bg-white/5 ">
                                <img
                                    src={deletingCertificate.imageUrl}
                                    alt={deletingCertificate.title}
                                    className="w-16 h-16 object-cover  border border-white/20"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNOSAxMmwyIDIgNC00bTYgMmE5IDkgMCAxMS0xOCAwIDkgOSAwIDAxMTggMHoiLz48L3N2Zz4=';
                                    }}
                                />
                                <div>
                                    <p className="text-white font-medium">{deletingCertificate.title}</p>
                                    <p className="text-white/60 text-sm line-clamp-2">{deletingCertificate.description}</p>
                                </div>
                            </div>
                        )}

                        <p className="text-white">
                            Are you sure you want to delete this certificate?
                            This action cannot be undone.
                        </p>

                        <div className="flex gap-2 justify-end mt-4">
                            <div onClick={() => {
                                setIsDeleteModalOpen(false);
                                setDeletingCertificate(null);
                            }}>
                                <Button bg="bg-gray-500/20" color="text-gray-400">
                                    Cancel
                                </Button>
                            </div>
                            <div onClick={handleDelete}>
                                <Button
                                    bg="bg-red-500/20"
                                    color="text-red-400"
                                    disabled={loading}
                                >
                                    {loading ? "Deleting..." : "Delete"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </PrivateLayout>
    );
}