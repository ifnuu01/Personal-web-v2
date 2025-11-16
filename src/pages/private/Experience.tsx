import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import PrivateLayout from "../../layouts/PrivateLayout";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Modal from "../../components/Modal";
import Table from "../../components/Table";
import { useExperience } from "../../hooks/useExperience";
import type { Experience } from "../../types/type";
import Textarea from "../../components/Textarea";

interface ExperienceForm extends Record<string, unknown> {
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
    icon: string;
}

export default function Experience() {
    const { items, loading, error, create, getAll, update, remove } = useExperience();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
    const [deletingExperience, setDeletingExperience] = useState<Experience | null>(null);
    const [formData, setFormData] = useState<ExperienceForm>({
        title: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
        icon: ""
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState("");
    const [isCurrentJob, setIsCurrentJob] = useState(false);
    const [iconPreview, setIconPreview] = useState("");

    useEffect(() => {
        getAll();
    }, []);

    const resetForm = () => {
        setFormData({
            title: "",
            company: "",
            startDate: "",
            endDate: "",
            description: "",
            icon: ""
        });
        setFormErrors({});
        setEditingExperience(null);
        setIsCurrentJob(false);
        setIconPreview("");
    };


    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetForm();
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));


        if (name === "icon") {
            setIconPreview(value);
        }


        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: "" }));
        }
    };


    const handleCurrentJobToggle = (checked: boolean) => {
        setIsCurrentJob(checked);
        if (checked) {
            setFormData(prev => ({ ...prev, endDate: "" }));
            if (formErrors.endDate) {
                setFormErrors(prev => ({ ...prev, endDate: "" }));
            }
        }
    };


    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.title.trim()) {
            errors.title = "Job title is required";
        }

        if (!formData.company.trim()) {
            errors.company = "Company name is required";
        }

        if (!formData.startDate) {
            errors.startDate = "Start date is required";
        }

        if (!isCurrentJob && !formData.endDate) {
            errors.endDate = "End date is required (or check 'Current Job')";
        }

        if (!formData.description.trim()) {
            errors.description = "Job description is required";
        }

        if (!formData.icon.trim()) {
            errors.icon = "Company icon is required";
        }


        if (formData.startDate && formData.endDate) {
            const startDate = new Date(formData.startDate);
            const endDate = new Date(formData.endDate);
            if (endDate <= startDate) {
                errors.endDate = "End date must be after start date";
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const handleSubmit = async () => {
        if (!validateForm()) return;


        const submitData = {
            ...formData,
            endDate: isCurrentJob ? null : formData.endDate
        };

        try {
            let message;
            if (editingExperience) {
                message = await update(editingExperience._id, submitData);
            } else {
                message = await create(submitData);
            }

            if (message) {
                setSuccessMessage(message);
                setTimeout(() => setSuccessMessage(""), 3000);
            }

            handleCloseModal();
            getAll();
        } catch {
            console.log("Submission failed");
        }
    };


    const handleEdit = async (experience: Experience) => {
        setEditingExperience(experience);
        setFormData({
            title: experience.title,
            company: experience.company,
            startDate: experience.startDate,
            endDate: experience.endDate || "",
            description: experience.description,
            icon: experience.icon
        });
        setIconPreview(experience.icon);
        setIsCurrentJob(!experience.endDate);
        setIsModalOpen(true);
    };


    const handleDeleteConfirm = (experience: Experience) => {
        setDeletingExperience(experience);
        setIsDeleteModalOpen(true);
    };


    const handleDelete = async () => {
        if (!deletingExperience) return;

        try {
            const message = await remove(deletingExperience._id);
            if (message) {
                setSuccessMessage(message);
                setTimeout(() => setSuccessMessage(""), 3000);
            }

            setIsDeleteModalOpen(false);
            setDeletingExperience(null);
            getAll();
        } catch {
            console.log("Deletion failed");
        }
    };


    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short'
        });
    };


    const columns = [
        {
            key: "company",
            label: "Company",
            render: (value: unknown, row: Experience) => (
                <div className="flex items-center gap-3">
                    <Icon icon={row.icon} className="text-2xl" />
                    <span className="font-medium">{String(value)}</span>
                </div>
            )
        },
        {
            key: "duration",
            label: "Duration",
            render: (_: unknown, row: Experience) => (
                <div className="text-sm">
                    <div>{formatDate(row.startDate)} - {row.endDate ? formatDate(row.endDate) : "Present"}</div>
                    <div className="text-white/60">
                        {row.endDate ?
                            `${Math.ceil((new Date(row.endDate).getTime() - new Date(row.startDate).getTime()) / (1000 * 3600 * 24 * 30))} months` :
                            `${Math.ceil((new Date().getTime() - new Date(row.startDate).getTime()) / (1000 * 3600 * 24 * 30))} months (ongoing)`
                        }
                    </div>
                </div>
            )
        },
        {
            key: "description",
            label: "Description",
            render: (value: unknown) => (
                <div className="max-w-md">
                    <p className="text-sm text-white/80 line-clamp-2">
                        {String(value).substring(0, 100)}{String(value).length > 100 ? '...' : ''}
                    </p>
                </div>
            )
        },
        {
            key: "actions",
            label: "Actions",
            render: (_: unknown, row: Experience) => (
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
                        <h1 className="text-3xl font-bold text-white mb-2">Experience Management</h1>
                        <p className="text-white/60">Manage your work experience and career history</p>
                    </div>
                    <div onClick={() => setIsModalOpen(true)}>
                        <Button bg="bg-green-500/20" color="text-green-400" className="font-bold">
                            <Icon icon="material-symbols:add" />
                            Add Experience
                        </Button>
                    </div>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                        <p className="text-green-400">{successMessage}</p>
                    </div>
                )}

                {/* Error Messages */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
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

                {/* Table */}
                <Table<Experience>
                    columns={columns}
                    data={items}
                    loading={loading}
                />

                {/* Create/Edit Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={editingExperience ? "Edit Experience" : "Add Experience"}
                    className="max-w-3xl"
                >
                    <div className="flex flex-col gap-1">
                        <div className="mb-4">
                            <Input
                                label="Job Title"
                                type="text"
                                placeholder="e.g. Software Engineer, Product Manager"
                                value={formData.title}
                                onChange={handleInputChange}
                                name="title"
                                id="title"
                                error={formErrors.title}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                <Input
                                    label="Company Name"
                                    type="text"
                                    placeholder="e.g. Google, Microsoft, Startup Inc."
                                    value={formData.company}
                                    onChange={handleInputChange}
                                    name="company"
                                    id="company"
                                    error={formErrors.company}
                                    required
                                />
                            </div>

                            {iconPreview && (
                                <div className="flex items-end">
                                    <div className="flex items-center gap-3 p-4 w-full">
                                        <Icon icon={iconPreview} className="text-3xl" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Date Range */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Start Date"
                                type="date"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                name="startDate"
                                id="startDate"
                                error={formErrors.startDate}
                                required
                            />

                            <div>
                                <Input
                                    label="End Date"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={handleInputChange}
                                    name="endDate"
                                    id="endDate"
                                    error={formErrors.endDate}
                                    required={!isCurrentJob}
                                />
                                <div className="flex items-center gap-2 mt-2">
                                    <input
                                        type="checkbox"
                                        id="currentJob"
                                        checked={isCurrentJob}
                                        onChange={(e) => handleCurrentJobToggle(e.target.checked)}
                                        className="w-4 h-4 accent-green-400"
                                    />
                                    <label htmlFor="currentJob" className="text-white/80 text-sm">
                                        I currently work here
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <Textarea
                            label="Job Description"
                            placeholder="Describe your role, responsibilities, and achievements..."
                            value={formData.description}
                            onChange={handleInputChange}
                            name="description"
                            id="description"
                            error={formErrors.description}
                            required
                            rows={4}
                        />

                        {/* Icon Selection */}
                        <div>
                            <Input
                                label="Company Icon"
                                type="text"
                                placeholder="e.g. logos:google, material-symbols:business"
                                value={formData.icon}
                                onChange={handleInputChange}
                                name="icon"
                                id="icon"
                                error={formErrors.icon}
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
                                    disabled={loading}
                                >
                                    {loading ? "Saving..." : (editingExperience ? "Update" : "Create")}
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
                        setDeletingExperience(null);
                    }}
                    title="Delete Experience"
                >
                    <div className="flex flex-col gap-4">
                        {deletingExperience && (
                            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                                <Icon icon={deletingExperience.icon} className="text-3xl" />
                                <div>
                                    <p className="text-white font-medium">{deletingExperience.company}</p>
                                    <p className="text-white/60 text-sm">
                                        {formatDate(deletingExperience.startDate)} -
                                        {deletingExperience.endDate ? formatDate(deletingExperience.endDate) : "Present"}
                                    </p>
                                </div>
                            </div>
                        )}

                        <p className="text-white">
                            Are you sure you want to delete this work experience?
                            This action cannot be undone.
                        </p>

                        <div className="flex gap-2 justify-end mt-4">
                            <div onClick={() => {
                                setIsDeleteModalOpen(false);
                                setDeletingExperience(null);
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
