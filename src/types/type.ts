export interface ValidationError {
    [key: string]: string[];
};

export interface WithId {
    id? : number | string;
    _id? : number | string;
};

export interface User {
    _id: number;
    username: string;
    password: string;
    role: string;
    createdAt: string;
    updatedAt: string;
};

export interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    error: ValidationError | null;
    loading: boolean;
    isInitialized: boolean;
    token: string | null;
};

export interface Category {
    _id: number | string;
    name: string;
    createdAt: string;
    updatedAt: string;
};

export interface Certificate {
    _id: number | string;
    imageUrl: string;
    title: string;
    description: string;
    link: string;
    createdAt: string;
    updatedAt: string;
};

export interface Experience {
    _id: number | string;
    company: string;
    startDate: string;
    endDate: string | null;
    description: string;
    icon: string;
    createdAt: string;
    updatedAt: string;
};

export interface Project {
    _id: number | string;
    imageSrc: string;
    title: string;
    description: string;
    linkIcon: string;
    linkUrl: string;
    techIcons: [{
        src: string;
        alt: string;
    }];
    category: Category;
    createdAt: string;
    updatedAt: string;
};

export interface Tech {
    _id: number | string;
    icon: string;
    createdAt: string;
    updatedAt: string;
};

export interface Blog {
    _id: number | string;
    title: string;
    slug: string;
    imageUrl: string;
    content: string;
    category: Category;
    createdAt: string;
    updatedAt: string;
};