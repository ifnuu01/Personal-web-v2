import type { Blog } from "../types/type";
import Button from "./Button"
import Modal from "./Modal"
import { useState } from "react"
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function BlogCard({ blog }: { blog: Blog }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div
                className="flex flex-col bg-white/10 w-100 backdrop-blur-xs hover:bg-white/20 hover:scale-98 transition-all duration-300 overflow-hidden">
                <header className="w-full h-50">
                    <img src={blog.imageUrl} alt="image" className="w-full h-50 object-cover" />
                </header>
                <div className="p-4 space-y-1 text-white">
                    <div className="flex justify-between items-center">
                        <h2 className="text-white text-2xl">{blog.title.slice(0, 20)}</h2>
                        <span className="text-lg">{blog.category.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-sm">{blog.content.slice(0, 30)}...</p>
                        <div className="w-full flex justify-end">
                            <Button onClick={() => setIsModalOpen(true)}>
                                Read More &gt;
                            </Button>
                        </div>
                    </div>
                </div>
            </div >
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={blog.title}
            >
                <div>
                    <div className="space-y-4">
                        <img src={blog.imageUrl} alt="image" className="w-full h-80 object-cover" />
                        <div className="prose prose-invert max-w-none text-white">
                            <ReactMarkdown
                                children={blog.content || ""}
                                components={{
                                    code({ className, children, ...props }) {
                                        const match = /language-(\w+)/.exec(className || "");
                                        return match ? (
                                            <SyntaxHighlighter
                                                style={oneDark}
                                                language={match[1]}
                                                PreTag="div"
                                                {...props}
                                            >
                                                {String(children).replace(/\n$/, "")}
                                            </SyntaxHighlighter>
                                        ) : (
                                            <code className={className} {...props}>
                                                {children}
                                            </code>
                                        );
                                    },
                                }}
                            />
                        </div>
                    </div>
                    <div className="w-full flex justify-end">
                        <Button
                            onClick={() => setIsModalOpen(false)}
                            bg="bg-blue-400/20"
                            color="text-blue-500"
                        >
                            Back
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default BlogCard