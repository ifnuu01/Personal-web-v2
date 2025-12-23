import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import PrivateLayout from "../../layouts/PrivateLayout";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Modal from "../../components/Modal";
import Table from "../../components/Table";
import { useBlog } from "../../hooks/useBlog";
import { useCategory } from "../../hooks/useCategory";
import apiClient from "../../hooks/apiClient";
import type { Blog } from "../../types/type";
import ImageUpload from "../../components/ImageUpload";
import { MarkdownEditor } from "../../components/MarkdownEditor";

interface BlogForm extends Record<string, unknown> {
    title: string;
    categoryId: string;
}

export default function Blog() {
    const { items: blogs, loading: blogLoading, error: blogError, getAll: getAllBlogs, remove } = useBlog();
    const { items: categories, getAll: getAllCategories } = useCategory();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
    const [deletingBlog, setDeletingBlog] = useState<Blog | null>(null);
    const [formData, setFormData] = useState<BlogForm>({
        title: "",
        categoryId: ""
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [blogMarkdown, setBlogMarkdown] = useState("");
    const [initialBlogMarkdown, setInitialBlogMarkdown] = useState("");

    useEffect(() => {
        getAllBlogs();
        getAllCategories();
    }, []);

    const resetForm = () => {
        setFormData({
            title: "",
            slug: "",
            categoryId: ""
        });
        setSelectedFile(null);
        setFormErrors({});
        setEditingBlog(null);
        setSuccessMessage("");
        setBlogMarkdown("");
        setInitialBlogMarkdown("");
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));


        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleMarkdownChange = (markdown: string) => {
        setBlogMarkdown(markdown);
    };

    const handleFileChange = (file: File | null) => {
        setSelectedFile(file);
        if (formErrors.image) {
            setFormErrors(prev => ({ ...prev, image: "" }));
        }
    };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.title.trim()) {
            errors.title = "Blog title is required";
        }

        if (!blogMarkdown.trim()) {
            errors.content = "Blog content is required";
        }

        if (!formData.categoryId) {
            errors.categoryId = "Category is required";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('content', blogMarkdown);
            formDataToSend.append('category', formData.categoryId);

            if (selectedFile) {
                formDataToSend.append('image', selectedFile);
            }

            let response;
            if (editingBlog) {
                response = await apiClient.put(`blogs/${editingBlog._id}`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                response = await apiClient.post('blogs', formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            setSuccessMessage(response.data.message || `Blog ${editingBlog ? 'updated' : 'created'} successfully!`);
            await getAllBlogs();

            setTimeout(() => {
                handleCloseModal();
            }, 500);

        } catch (error: unknown) {
            console.error('Error submitting blog:', error);
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { data?: { errors?: Record<string, string> } } };
                if (axiosError.response?.data?.errors) {
                    setFormErrors(axiosError.response.data.errors);
                }
            }
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleEdit = async (blog: Blog) => {
        setEditingBlog(blog);
        setFormData({
            title: blog.title,
            categoryId: String(blog.category._id)
        });
        setInitialBlogMarkdown(blog.content);
        setSelectedFile(null);
        setIsModalOpen(true);
    };


    const handleDeleteConfirm = (blog: Blog) => {
        setDeletingBlog(blog);
        setIsDeleteModalOpen(true);
    };


    const handleDelete = async () => {
        if (!deletingBlog) return;

        try {
            await remove(deletingBlog._id);
            setSuccessMessage("Blog deleted successfully!");
            setIsDeleteModalOpen(false);
            setDeletingBlog(null);
            setTimeout(() => setSuccessMessage(""), 500);
            getAllBlogs();
        } catch {
            console.error('Error deleting blog');
        }
    };

    const columns = [
        {
            key: "imageUrl",
            label: "Image",
            render: (_: unknown, row: Blog) => (
                <div className="w-16 h-16 overflow-hidden rounded border border-white/20 flex items-center justify-center">
                    {row.imageUrl ? (
                        <img
                            src={row.imageUrl}
                            alt={row.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder-image.jpg';
                            }}
                        />
                    ) : (
                        <span className="block my-auto">No Image</span>
                    )}
                </div>
            )
        },
        {
            key: "title",
            label: "Title",
            render: (value: unknown) => (
                <div className="font-semibold truncate max-w-[200px]" title={String(value)}>
                    {String(value)}
                </div>
            )
        },
        {
            key: "slug",
            label: "Slug",
            render: (value: unknown) => (
                <div className="font-mono text-sm text-blue-400 truncate max-w-[150px]" title={String(value)}>
                    {String(value)}
                </div>
            )
        },
        {
            key: "category",
            label: "Category",
            render: (_: unknown, row: Blog) => (
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-sm">
                    {row.category?.name || 'No Category'}
                </span>
            )
        },
        {
            key: "createdAt",
            label: "Created",
            render: (value: unknown) => {
                const date = new Date(String(value));
                return date.toLocaleDateString('id-ID');
            }
        },
        {
            key: "actions",
            label: "Actions",
            render: (_: unknown, row: Blog) => (
                <div className="flex items-center gap-2">
                    <div onClick={() => handleEdit(row)}>
                        <Button bg="bg-blue-500/20" color="text-blue-400">
                            <Icon icon="material-symbols:edit-outline" />
                        </Button>
                    </div>
                    <div onClick={() => handleDeleteConfirm(row)}>
                        <Button bg="bg-red-500/20" color="text-red-400">
                            <Icon icon="material-symbols:delete" />
                        </Button>
                    </div>
                </div>
            )
        }
    ];

    return (
        <PrivateLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">Blog Management</h1>
                    <div onClick={() => setIsModalOpen(true)}>
                        <Button bg="bg-green-500/20" color="text-green-400">
                            <Icon icon="material-symbols:add" />
                            Add New Blog
                        </Button>
                    </div>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-3 rounded">
                        {successMessage}
                    </div>
                )}

                {/* Error Message */}
                {blogError && (
                    <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded">
                        <div className="font-semibold">Error:</div>
                        <div className="text-sm">
                            {Object.entries(blogError).map(([field, messages]) => (
                                <div key={field}>
                                    <strong>{field}:</strong> {Array.isArray(messages) ? messages.join(', ') : messages}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Table */}
                <Table
                    columns={columns}
                    data={blogs}
                    loading={blogLoading}
                    className="rounded"
                />

                {/* Add/Edit Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={editingBlog ? "Edit Blog" : "Add New Blog"}
                    className="max-w-4xl max-h-[90vh]"
                >
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            <Input
                                label="Title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Enter blog title"
                                error={formErrors.title}
                                required
                            />
                        </div>

                        <ImageUpload
                            label="Blog Image"
                            onFileChange={handleFileChange}
                            error={formErrors.image}
                            existingImageUrl={editingBlog?.imageUrl}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div className="flex flex-col gap-2">
                                <label className="text-white font-medium">
                                    Category <span className="text-red-400">*</span>
                                </label>
                                <select
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleInputChange}
                                    className="w-full bg-white/10 outline-none border-none px-4 py-2 text-white focus:bg-white/20 transition-all"
                                >
                                    <option value="" className="bg-secondary text-white">Select Category</option>
                                    {categories.map((category) => (
                                        <option key={category._id} value={category._id} className="bg-secondary text-white">
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {formErrors.categoryId && (
                                    <span className="text-red-400 text-sm">{formErrors.categoryId}</span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-white font-medium">
                                Content <span className="text-red-400">*</span>
                            </label>
                            <div className="bg-white/5 rounded border border-white/10 overflow-hidden">
                                <MarkdownEditor
                                    initialMarkdown={initialBlogMarkdown}
                                    onMarkdownChange={handleMarkdownChange}
                                />
                            </div>
                            {formErrors.content && (
                                <span className="text-red-400 text-sm">{formErrors.content}</span>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4">
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
                                    {isSubmitting ? "Saving..." : (editingBlog ? "Update" : "Create")}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Modal>

                {/* Delete Confirmation Modal */}
                <Modal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    title="Delete Blog"
                    className="max-w-md"
                >
                    <div className="space-y-4">
                        <p className="text-white/80">
                            Are you sure you want to delete the blog "{deletingBlog?.title}"? This action cannot be undone.
                        </p>
                        <div className="flex items-center justify-end gap-3">
                            <div onClick={() => setIsDeleteModalOpen(false)}>
                                <Button bg="bg-gray-500/20" color="text-gray-400">
                                    Cancel
                                </Button>
                            </div>
                            <div onClick={handleDelete}>
                                <Button bg="bg-red-500/20" color="text-red-400" disabled={blogLoading}>
                                    <Icon icon="material-symbols:delete" />
                                    {blogLoading ? "Deleting..." : "Delete"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </PrivateLayout>
    );
}
