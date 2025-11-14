import Button from "../components/Button";

export default function Public({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="pt-40 px-4 md:px-10 lg:px-30"
        >
            <div className="fixed right-0 top-80 flex flex-col justify-end">
                <a href="https://www.linkedin.com/in/ifnu-umar-03859930a/" target="_blank" rel="noopener noreferrer">
                    <Button>
                        X
                    </Button>
                </a>
                <a href="https://github.com/ifnuu01" target="_blank" rel="noopener noreferrer">
                    <Button>
                        X
                    </Button>
                </a>
            </div>
            {children}
        </div >
    )
}
