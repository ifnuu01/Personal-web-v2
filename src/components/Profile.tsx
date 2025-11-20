import { Icon } from "@iconify/react";
import Button from "./Button";
import Modal from "./Modal";
import { useState } from "react";
import Input from "./Input";
import Textarea from "./Textarea";
import { motion } from "framer-motion";

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
        <div className="md:pt-10 flex flex-col md:flex-row justify-between items-center gap-20 overflow-hidden">
            {/* Animasi untuk Gambar Profil */}
            <motion.div
                id="profile"
                className="relative md:order-2"
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8 }}
            >
                <div className="absolute py-4 px-5 bg-white left-1 top-10 animate-bounce">
                    <h1 className="font-bold text-2xl">
                        <Icon icon="pixel:code-solid" />
                    </h1>
                </div>
                <img src="/me.png" alt="Profile Picture" className="bg-white/10 rounded-full px-4" />
            </motion.div>
            <div id="info" className="text-white space-y-4">
                {/* Judul */}
                <motion.h1
                    className="text-5xl animate-pulse"
                    initial={{ opacity: 0, x: -100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Fullstack Developer
                </motion.h1>

                {/* Paragraf */}
                <motion.p
                    className="max-w-3xl"
                    initial={{ opacity: 0, x: -100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    I am an Informatics Engineering student at Mulawarman University with a strong passion for web development. While I have skills across the full stack, my primary interest and expertise lie in back-end development.
                    I enjoy designing and building robust APIs, managing databases (like MongoDB, MySQL, PostgreSQL), and ensuring optimal server-side performance. I am proficient in back-end technologies such as Node.js and Laravel, and I am also experienced with front-end frameworks like React.
                    I am actively applying these skills through personal projects and my involvement in the ASCII (Association of Students Computer and Informatics) student organization, where I also hone my teamwork and leadership skills.
                    I am actively seeking internship or entry-level opportunities where I can contribute to challenging projects and grow as a back-end developer.
                </motion.p>

                {/* Tombol */}
                <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <Button
                        onClick={() => setIsModalOpen(true)}
                    >
                        <span className="text-3xl">Contact Me &gt;</span>
                    </Button>
                </motion.div>
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