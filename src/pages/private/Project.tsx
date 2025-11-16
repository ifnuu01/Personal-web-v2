import React, { useState, useEffect } from "react";
import PrivateLayout from "../../layouts/PrivateLayout";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Modal from "../../components/Modal";
import Table from "../../components/Table";
import { Icon } from "@iconify/react";
import { useProject } from "../../hooks/useProject";
import { useCategory } from "../../hooks/useCategory";
import { useTech } from "../../hooks/useTech";
import type { Project, Category } from "../../types/type";
import apiClient from "../../hooks/apiClient";
import Textarea from "../../components/Textarea";
import ImageUpload from "../../components/ImageUpload";

interface ProjectForm extends Record<string, unknown> {
    title: string;
    description: string;
    linkUrl: string;
    linkIcon: string;
    category: string;
    techIcons: string[];
}
export default function Project() {
    const { items, loading, error, getAll, remove } = useProject();
    const { items: categories, getAll: getAllCategories } = useCategory();
    const { items: techItems, getAll: getAllTech } = useTech();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [deletingProject, setDeletingProject] = useState<Project | null>(null);
    const [formData, setFormData] = useState<ProjectForm>({
        title: "",
        description: "",
        linkUrl: "",
        linkIcon: "material-symbols:open-in-new",
        category: "",
        techIcons: []
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        getAll();
        getAllCategories();
        getAllTech();
    }, []);

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            linkUrl: "",
            linkIcon: "material-symbols:open-in-new",
            category: "",
            techIcons: []
        });
        setSelectedFile(null);
        setFormErrors({});
        setEditingProject(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

    const handleTechToggle = (techIcon: string) => {
        setFormData(prev => ({
            ...prev,
            techIcons: prev.techIcons.includes(techIcon)
                ? prev.techIcons.filter(t => t !== techIcon)
                : [...prev.techIcons, techIcon]
        }));
    };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!selectedFile && !editingProject) {
            errors.image = "Project image is required";
        }
        if (!formData.title.trim()) {
            errors.title = "Project title is required";
        }
        if (!formData.description.trim()) {
            errors.description = "Project description is required";
        }
        if (!formData.linkUrl.trim()) {
            errors.linkUrl = "Project URL is required";
        }
        if (!formData.category) {
            errors.category = "Please select a category";
        }
        if (formData.techIcons.length === 0) {
            errors.techIcons = "Please select at least one technology";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
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
            formDataToSend.append('linkUrl', formData.linkUrl);
            formDataToSend.append('linkIcon', formData.linkIcon);
            formDataToSend.append('category', formData.category);
            formData.techIcons.forEach((icon, index) => {
                const altText = icon.split(':')[1] || icon.replace('devicon:', '').replace('-original', '').replace('-plain', '');
                formDataToSend.append(`techIcons[${index}][src]`, icon);
                formDataToSend.append(`techIcons[${index}][alt]`, altText);
            });

            let response;
            if (editingProject) {
                console.log('Making PUT request to:', `projects/${editingProject._id}`);
                response = await apiClient.put(`projects/${editingProject._id}`, formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                console.log('Making POST request to: projects');
                response = await apiClient.post('projects', formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            if (response.data.message) {
                setSuccessMessage(response.data.message);
                setTimeout(() => setSuccessMessage(""), 3000);
            }

            handleCloseModal();
            getAll();
        } catch (error) {
            console.error('Error submitting form:', error);
            setFormErrors({ submit: 'An error occurred while submitting the form' });
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setFormData({
            title: project.title,
            description: project.description,
            linkUrl: project.linkUrl,
            linkIcon: project.linkIcon,
            category: typeof project.category === 'object' ? String(project.category._id) : String(project.category),
            techIcons: project.techIcons?.map(tech => tech.src) || []
        });
        setSelectedFile(null);
        setIsModalOpen(true);
    };

    const handleDeleteConfirm = (project: Project) => {
        setDeletingProject(project);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!deletingProject) return;

        try {
            const message = await remove(deletingProject._id);
            if (message) {
                setSuccessMessage(message);
                setTimeout(() => setSuccessMessage(""), 3000);
            }
            setIsDeleteModalOpen(false);
            setDeletingProject(null);
            getAll();
        } catch {
            console.log("Deletion failed");
        }
    };

    const getCategoryName = (category: Category | string) => {
        if (typeof category === 'object') {
            return category.name;
        }
        const cat = categories.find(c => c._id === category);
        return cat ? cat.name : 'Unknown';
    };

    const columns = [
        {
            key: "imageSrc",
            label: "Project",
            render: (value: unknown, row: Project) => (
                <div className="flex items-center gap-4">
                    <img
                        src={String(value)}
                        alt={row.title}
                        className="w-16 h-16 object-cover border border-white/20"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                        }}
                    />
                    <div>
                        <div className="font-medium text-white">{row.title}</div>
                        <div className="text-white/60 text-sm">{getCategoryName(row.category)}</div>
                    </div>
                </div>
            )
        },
        {
            key: "techIcons",
            label: "Tech Stack",
            render: (value: unknown) => {
                const techIcons = value as Project['techIcons'];
                return (
                    <div className="flex gap-1">
                        {techIcons?.slice(0, 4).map((tech, index) => (
                            <Icon key={index} icon={tech.src} className="text-white text-lg" />
                        ))}
                        {techIcons && techIcons.length > 4 && (
                            <span className="text-white/60 text-sm">+{techIcons.length - 4}</span>
                        )}
                    </div>
                );
            }
        },
        {
            key: "linkUrl",
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
            key: "actions",
            label: "Actions",
            render: (_: unknown, row: Project) => (
                <div className="flex gap-2">
                    <Button onClick={() => handleEdit(row)} bg="bg-blue-500/20" color="text-blue-400">
                        <Icon icon="material-symbols:edit" />
                    </Button>
                    <Button onClick={() => handleDeleteConfirm(row)} bg="bg-red-500/20" color="text-red-400">
                        <Icon icon="material-symbols:delete" />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <PrivateLayout>
            <div className="pt-6 px-0">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Project Management</h1>
                        <p className="text-white/70">Manage your portfolio projects</p>
                    </div>
                    <div onClick={() => setIsModalOpen(true)}>
                        <Button bg="bg-green-500/20" color="text-green-400" className="font-bold">
                            <Icon icon="material-symbols:add" />
                            Add Project
                        </Button>
                    </div>
                </div>

                {successMessage && (
                    <div className="mb-4 p-4 bg-green-500/20 border border-green-400 rounded">
                        <div className="flex items-center gap-2 text-green-300">
                            <Icon icon="material-symbols:check-circle" />
                            <span>{successMessage}</span>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-4 bg-red-500/20 border border-red-400 rounded">
                        <div className="flex items-center gap-2 text-red-300">
                            <Icon icon="material-symbols:error" />
                            <span>
                                {typeof error === 'string' ? error : Object.values(error).flat().join(', ')}
                            </span>
                        </div>
                    </div>
                )}

                <Table<Project>
                    columns={columns}
                    data={items}
                    loading={loading}
                />

                {/* Add/Edit Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={editingProject ? "Edit Project" : "Add New Project"}
                    className="max-w-2xl"
                >
                    <div className="space-y-4">
                        <ImageUpload
                            label="Project Image"
                            onFileChange={handleFileChange}
                            error={formErrors.image}
                            required={!editingProject}
                            existingImageUrl={editingProject?.imageSrc}
                        />

                        <Input
                            label="Project Title"
                            placeholder="Enter project title"
                            value={formData.title}
                            onChange={handleInputChange}
                            name="title"
                            error={formErrors.title}
                            required
                        />

                        <Textarea
                            label="Project Description"
                            placeholder="Enter project description"
                            value={formData.description}
                            onChange={handleInputChange}
                            name="description"
                            error={formErrors.description}
                            required
                            rows={4}
                        />

                        <Input
                            label="Project URL"
                            placeholder="https://example.com"
                            value={formData.linkUrl}
                            onChange={handleInputChange}
                            name="linkUrl"
                            error={formErrors.linkUrl}
                            required
                        />

                        <div className="flex flex-col gap-2">
                            <Input
                                label="Link Icon"
                                placeholder="Enter icon name (e.g., material-symbols:open-in-new)"
                                value={formData.linkIcon}
                                onChange={handleInputChange}
                                name="linkIcon"
                                error={formErrors.linkIcon}
                                required
                            />
                            <div className="flex items-center gap-2 text-white/60 text-sm">
                                <span>Preview:</span>
                                <Icon icon={formData.linkIcon} className="text-lg" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-white font-medium">
                                Category <span className="text-red-400">*</span>
                            </label>
                            <select
                                value={formData.category}
                                onChange={handleInputChange}
                                name="category"
                                className="w-full bg-white/10 outline-none border-none px-4 py-2 text-white focus:bg-white/20 transition-all"
                            >
                                <option value="" className="bg-secondary text-white">Select category</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id} className="bg-secondary text-white">
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {formErrors.category && <span className="text-red-400 text-sm">{formErrors.category}</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-white font-medium">
                                Technology Stack <span className="text-red-400">*</span>
                            </label>
                            <div className="grid grid-cols-8 gap-1 max-h-32 overflow-y-auto p-2 bg-white/5 rounded border border-white/10">
                                {techItems.map((tech) => (
                                    <button
                                        key={tech._id}
                                        type="button"
                                        onClick={() => handleTechToggle(tech.icon)}
                                        className={`
                                            flex items-center justify-center p-1.5 rounded border transition-all
                                            ${formData.techIcons.includes(tech.icon)
                                                ? 'bg-blue-500/30 border-blue-400 text-blue-300'
                                                : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                                            }
                                        `}
                                    >
                                        <Icon icon={tech.icon} className="text-lg" />
                                    </button>
                                ))}
                            </div>
                            {formData.techIcons.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1 max-h-16 overflow-y-auto">
                                    <span className="text-white/60 text-xs">Selected: </span>
                                    {formData.techIcons.map((techIcon) => (
                                        <span key={techIcon} className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded text-xs">
                                            <Icon icon={techIcon} className="text-xs" />
                                            <button
                                                type="button"
                                                onClick={() => handleTechToggle(techIcon)}
                                                className="text-blue-300 hover:text-red-300 text-xs"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                            {formErrors.techIcons && <span className="text-red-400 text-sm">{formErrors.techIcons}</span>}
                        </div>

                        {formErrors.submit && (
                            <div className="p-4 bg-red-500/20 border border-red-400 rounded">
                                <div className="flex items-center gap-2 text-red-300">
                                    <Icon icon="material-symbols:error" />
                                    <span>{formErrors.submit}</span>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4">
                            <Button onClick={handleCloseModal}
                                bg="bg-gray-500/20"
                                color="text-gray-400"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                bg="bg-green-500/20"
                                color="text-green-400"
                            >
                                {isSubmitting ? "Saving..." : (editingProject ? "Update" : "Create")}
                            </Button>
                        </div>
                    </div>
                </Modal>

                {/* Delete Confirmation Modal */}
                <Modal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    title="Delete Project"
                >
                    <div className="space-y-4">
                        <p className="text-white/70">
                            Are you sure you want to delete "{deletingProject?.title}"? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button onClick={() => setIsDeleteModalOpen(false)} bg="bg-gray-500 hover:bg-gray-600">
                                Cancel
                            </Button>
                            <Button onClick={handleDelete} bg="bg-red-500 hover:bg-red-600">
                                <Icon icon="material-symbols:delete" />
                                {loading ? "Deleting..." : "Delete"}
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </PrivateLayout>
    );
}
