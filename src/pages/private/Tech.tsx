import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import PrivateLayout from "../../layouts/PrivateLayout";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Modal from "../../components/Modal";
import Table from "../../components/Table";
import { useTech } from "../../hooks/useTech";
import type { Tech } from "../../types/type";

interface TechForm extends Record<string, unknown> {
    icon: string;
}

export default function Tech() {
    const { items, loading, error, create, getAll, update, remove } = useTech();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingTech, setEditingTech] = useState<Tech | null>(null);
    const [deletingTech, setDeletingTech] = useState<Tech | null>(null);
    const [formData, setFormData] = useState<TechForm>({ icon: "" });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState("");
    const [iconPreview, setIconPreview] = useState("");

    useEffect(() => {
        getAll();
    }, []);

    const resetForm = () => {
        setFormData({ icon: "" });
        setFormErrors({});
        setEditingTech(null);
        setIconPreview("");
    };


    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetForm();
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));


        if (name === "icon") {
            setIconPreview(value);
        }


        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: "" }));
        }
    };


    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.icon.trim()) {
            errors.icon = "Tech icon is required";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            let message;
            if (editingTech) {
                message = await update(editingTech._id, formData);
            } else {
                message = await create(formData);
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


    const handleEdit = async (tech: Tech) => {
        setEditingTech(tech);
        setFormData({ icon: tech.icon });
        setIconPreview(tech.icon);
        setIsModalOpen(true);
    };


    const handleDeleteConfirm = (tech: Tech) => {
        setDeletingTech(tech);
        setIsDeleteModalOpen(true);
    };


    const handleDelete = async () => {
        if (!deletingTech) return;

        try {
            const message = await remove(deletingTech._id);
            if (message) {
                setSuccessMessage(message);
                setTimeout(() => setSuccessMessage(""), 3000);
            }

            setIsDeleteModalOpen(false);
            setDeletingTech(null);
            getAll();
        } catch {
            console.log("Deletion failed");
        }
    };


    const popularIcons = [
        "mdi:react",
        "mdi:vuejs",
        "mdi:angular",
        "cib:js",
        "teenyicons:typescript-solid",
        "mdi:nodejs",
        "lineicons:python",
        "mdi:language-java",
        "mdi:language-php",
        "mdi:laravel",
        "mdi:database",
        "simple-icons:postgresql",
        "simple-icons:mongodb",
        "mdi:git",
        "mdi:docker",
        "mdi:aws"
    ];


    const columns = [
        {
            key: "icon",
            label: "Icon",
            render: (value: unknown) => {
                if (typeof value === 'string') {
                    return (
                        <div className="flex items-center gap-3">
                            <Icon icon={value} className="text-2xl" />
                            <span className="text-sm text-white/60">{value}</span>
                        </div>
                    );
                }
                return String(value || '');
            }
        },
        {
            key: "createdAt",
            label: "Created At",
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
            render: (_: unknown, row: Tech) => (
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
                        <h1 className="text-3xl font-bold text-white mb-2">Tech Stack Management</h1>
                        <p className="text-white/60">Manage your technology stack icons</p>
                    </div>
                    <div onClick={() => setIsModalOpen(true)}>
                        <Button bg="bg-green-500/20" color="text-green-400" className="font-bold">
                            <Icon icon="material-symbols:add" />
                            Add Tech
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
                <Table<Tech>
                    columns={columns}
                    data={items}
                    loading={loading}
                />

                {/* Create/Edit Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={editingTech ? "Edit Tech" : "Add Tech"}
                    className="max-w-2xl"
                >
                    <div className="flex flex-col gap-6">
                        {/* Icon Preview */}
                        {iconPreview && (
                            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                                <Icon icon={iconPreview} className="text-4xl text-white" />
                                <div>
                                    <p className="text-white font-medium">Preview</p>
                                    <p className="text-white/60 text-sm">{iconPreview}</p>
                                </div>
                            </div>
                        )}

                        <Input
                            label="Icon Name"
                            type="text"
                            placeholder="e.g. logos:react, devicon:nodejs, etc."
                            value={formData.icon}
                            onChange={handleInputChange}
                            name="icon"
                            id="icon"
                            error={formErrors.icon}
                            required
                        />

                        {/* Popular Icons */}
                        <div>
                            <p className="text-white font-medium mb-3">Popular Icons</p>
                            <div className="grid grid-cols-4 gap-3 max-h-40 overflow-y-auto p-2 bg-white/5 rounded-lg">
                                {popularIcons.map((iconName) => (
                                    <div
                                        key={iconName}
                                        onClick={() => {
                                            setFormData(prev => ({ ...prev, icon: iconName }));
                                            setIconPreview(iconName);
                                            if (formErrors.icon) {
                                                setFormErrors(prev => ({ ...prev, icon: "" }));
                                            }
                                        }}
                                        className="flex flex-col items-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded cursor-pointer transition-all group"
                                    >
                                        <Icon icon={iconName} className="text-2xl group-hover:scale-110 transition-transform text-white" />
                                        <span className="text-xs text-white/60 text-center">{iconName.split(':')[1] || iconName}</span>
                                    </div>
                                ))}
                            </div>
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
                                    {loading ? "Saving..." : (editingTech ? "Update" : "Create")}
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
                        setDeletingTech(null);
                    }}
                    title="Delete Tech"
                >
                    <div className="flex flex-col gap-4">
                        {deletingTech && (
                            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                                <Icon icon={deletingTech.icon} className="text-3xl text-white" />
                                <div>
                                    <p className="text-white font-medium">{deletingTech.icon}</p>
                                    <p className="text-white/60 text-sm">This tech will be permanently deleted</p>
                                </div>
                            </div>
                        )}

                        <p className="text-white">
                            Are you sure you want to delete this tech?
                            This action cannot be undone.
                        </p>

                        <div className="flex gap-2 justify-end mt-4">
                            <div onClick={() => {
                                setIsDeleteModalOpen(false);
                                setDeletingTech(null);
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