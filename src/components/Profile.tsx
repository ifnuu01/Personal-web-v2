import { Icon } from "@iconify/react";
import Button from "./Button";
import Modal from "./Modal";
import { useState } from "react";
import Input from "./Input";
import Textarea from "./Textarea";

export default function Profile() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const waMessage = `Halo! Saya ${formData.name}.\n\nEmail: ${formData.email}\n\nPesan: ${formData.message}`;
        const encodedMessage = encodeURIComponent(waMessage);
        const waNumber = "6289501603099";
        const waUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`;

        window.open(waUrl, '_blank');

        setFormData({ name: '', email: '', message: '' });
        setIsModalOpen(false);
    };

    return (
        <div className="md:pt-10 flex flex-col md:flex-row justify-between items-center gap-20">
            <div id="profile" className="relative md:order-2">
                <div className="absolute py-4 px-5 bg-white left-1 top-10">
                    <h1 className="font-bold text-2xl">
                        <Icon icon="pixel:code-solid" />
                    </h1>
                </div>
                <img src="/me.png" alt="Profile Picture" className="bg-white/10 rounded-full px-4" />
            </div>
            <div id="info" className="text-white space-y-4">
                <h1 className="text-5xl">Fullstack Developer</h1>
                <p className="text-base max-w-3xl">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Neque sed error veniam. Perferendis error porro ad dolore, suscipit, ratione dolorem officiis facilis deserunt aperiam minus incidunt dolor, possimus veritatis pariatur blanditiis asperiores sit. Tempora, repellat nihil ut amet commodi sed.</p>
                <Button
                    onClick={() => setIsModalOpen(true)}
                >
                    <span className="text-3xl">Contact Me &gt;</span>
                </Button>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Contact Me"
                className="max-w-md"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Input
                            type="text"
                            id="name"
                            name="name"
                            label="Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            placeholder="Input your name.."
                        />
                    </div>

                    <div>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            label="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="Input your email.."
                        />
                    </div>

                    <div>
                        <Textarea
                            id="message"
                            name="message"
                            label="Message"
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                            placeholder="Write your message.."
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            bg="bg-red-500/20"
                            color="text-red-400"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            bg="bg-green-500/20"
                            color="text-green-400"
                        >
                            Send Message
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
