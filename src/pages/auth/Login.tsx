import { useContext, useEffect, useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import PublicLayout from "../../layouts/PublicLayout";
import { AuthContext } from "../../contexts/AuthContext";
import { Icon } from "@iconify/react";

export default function Login() {
    const [inputValue, setInputValue] = useState({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

    const auth = useContext(AuthContext);

    const validateForm = (): boolean => {
        const newErrors: { username?: string; password?: string } = {};

        if (!inputValue.username) {
            newErrors.username = 'Username is required';
        }
        if (!inputValue.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        const msg = await auth?.login(inputValue.username, inputValue.password);
        if (msg) {
            window.alert(msg);
        }
    };

    useEffect(() => {
        if (auth?.error?.message) {
            window.alert(auth.error.message);
        }
    }, [auth?.error?.message]);

    return (
        <PublicLayout>
            <div className="flex justify-center items-center mt-20">
                <form onSubmit={handleSubmit} className="flex flex-col justify-center w-96 bg-white/10 p-6 text-white space-y-4 backdrop-blur-xs">
                    <h1 className="text-4xl text-center">Login</h1>
                    <div>
                        <Input label="Username" placeholder="Enter your username" value={inputValue.username} onChange={(e) => setInputValue({ ...inputValue, username: e.target.value })} />
                        {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                    </div>
                    <div>
                        <Input label="Password" type="password" placeholder="Enter your password" value={inputValue.password} onChange={(e) => setInputValue({ ...inputValue, password: e.target.value })} />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>
                    <Button
                        type="submit"
                        bg="bg-blue-600/20"
                        color="text-blue-400"
                        className="mt-4 w-full justify-center"
                        disabled={auth?.loading}
                    >
                        <Icon icon="pixelarticons:login" />
                        {auth?.loading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>
            </div>
        </PublicLayout>
    )
}
