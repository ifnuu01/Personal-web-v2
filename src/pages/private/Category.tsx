import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import PrivateLayout from "../../layouts/PrivateLayout";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Modal from "../../components/Modal";
import Table from "../../components/Table";
import { useCategory } from "../../hooks/useCategory";
import type { Category } from "../../types/type";

interface CategoryForm {
    name: string;
}

export default function Category() {
    const { items, loading, error, create, getAll, update, remove } = useCategory();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState<CategoryForm>({ name: "" });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        getAll();
    }, []);

    const resetForm = () => {
        setFormData({ name: "" });
        setFormErrors({});
        setEditingCategory(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));


        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: "" }));
        }
    };


    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.name.trim()) {
            errors.name = "Category name is required";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            let message;
            if (editingCategory) {
                message = await update(editingCategory._id, formData);
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


    const handleEdit = async (category: Category) => {
        setEditingCategory(category);
        setFormData({ name: category.name });
        setIsModalOpen(true);
    };


    const handleDeleteConfirm = (category: Category) => {
        setDeletingCategory(category);
        setIsDeleteModalOpen(true);
    };


    const handleDelete = async () => {
        if (!deletingCategory) return;

        try {
            const message = await remove(deletingCategory._id);
            if (message) {
                setSuccessMessage(message);
                setTimeout(() => setSuccessMessage(""), 3000);
            }

            setIsDeleteModalOpen(false);
            setDeletingCategory(null);
            getAll();
        } catch {
            console.log("Deletion failed");
        }
    };


    const columns = [
        {
            key: "name",
            label: "Category Name"
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
            render: (_: unknown, row: Category) => (
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
                        <h1 className="text-3xl font-bold text-white mb-2">Category Management</h1>
                        <p className="text-white/60">Manage your project categories</p>
                    </div>
                    <div onClick={() => setIsModalOpen(true)}>
                        <Button bg="bg-green-500/20" color="text-green-400" className="font-bold">
                            <Icon icon="material-symbols:add" />
                            Add Category
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
                <Table<Category>
                    columns={columns}
                    data={items}
                    loading={loading}
                />

                {/* Create/Edit Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={editingCategory ? "Edit Category" : "Create Category"}
                >
                    <div className="flex flex-col gap-4">
                        <Input
                            label="Category Name"
                            type="text"
                            placeholder="Enter category name"
                            value={formData.name}
                            onChange={handleInputChange}
                            name="name"
                            id="name"
                            error={formErrors.name}
                            required
                        />

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
                                    {loading ? "Saving..." : (editingCategory ? "Update" : "Create")}
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
                        setDeletingCategory(null);
                    }}
                    title="Delete Category"
                >
                    <div className="flex flex-col gap-4">
                        <p className="text-white">
                            Are you sure you want to delete the category "{deletingCategory?.name}"?
                            This action cannot be undone.
                        </p>

                        <div className="flex gap-2 justify-end mt-4">
                            <div onClick={() => {
                                setIsDeleteModalOpen(false);
                                setDeletingCategory(null);
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
