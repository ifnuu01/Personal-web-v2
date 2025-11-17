import { Icon } from "@iconify/react";
import Button from "./Button";
import clsx from "clsx";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    className?: string;
}

export default function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-1000 p-4">
            <div className={clsx(
                "bg-secondary/90 backdrop-blur-md w-full max-w-5xl max-h-[90vh] flex flex-col",
                className
            )}>
                <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                    <div onClick={onClose}>
                        <Button bg="bg-red-500/20" color="text-red-400">
                            <Icon icon="material-symbols:close" />
                        </Button>
                    </div>
                </div>
                <div className="p-4 overflow-y-auto flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
}