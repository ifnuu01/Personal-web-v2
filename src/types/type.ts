export interface ValidationError {
    [key: string]: string[];
}

export interface WithId {
    id? : number | string;
    _id? : number | string;
}

export interface User {
    _id: number;
    username: string;
    password: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    error: ValidationError | null;
    loading: boolean;
    isInitialized: boolean;
    token: string | null;
}