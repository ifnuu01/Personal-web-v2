import { useEffect, useState } from "react";
import BlogCard from "../../components/BlogCard";
import { useBlog } from "../../hooks/useBlog";
import PublicLayout from "../../layouts/PublicLayout";
import Input from "../../components/Input";

const BlogSkeleton = () => {
    return (
        <>
            <div className="flex flex-col bg-white/10 w-100 backdrop-blur-xs hover:bg-white/20 hover:scale-98 transition-all duration-300 overflow-hidden animate-pulse">
                <div className="mt-4 p-4 space-y-1 text-white/10 animate-pulse">
                    <div className="flex gap-2">
                        <div className="h-6 w-1/4 bg-white/20"></div>
                        <div className="h-6 w-1/4 bg-white/20"></div>
                    </div>
                    <div className="h-6 w-3/4 bg-white/20"></div>
                    <div className="h-4 w-1/2 bg-white/20"></div>
                </div>
            </div>
            <div className="flex flex-col bg-white/10 w-100 backdrop-blur-xs hover:bg-white/20 hover:scale-98 transition-all duration-300 overflow-hidden animate-pulse">
                <div className="mt-4 p-4 space-y-1 text-white/10 animate-pulse">
                    <div className="flex gap-2">
                        <div className="h-6 w-1/4 bg-white/20"></div>
                        <div className="h-6 w-1/4 bg-white/20"></div>
                    </div>
                    <div className="h-6 w-3/4 bg-white/20"></div>
                    <div className="h-4 w-1/2 bg-white/20"></div>
                </div>
            </div>
            <div className="flex flex-col bg-white/10 w-100 backdrop-blur-xs hover:bg-white/20 hover:scale-98 transition-all duration-300 overflow-hidden animate-pulse">
                <div className="mt-4 p-4 space-y-1 text-white/10 animate-pulse">
                    <div className="flex gap-2">
                        <div className="h-6 w-1/4 bg-white/20"></div>
                        <div className="h-6 w-1/4 bg-white/20"></div>
                    </div>
                    <div className="h-6 w-3/4 bg-white/20"></div>
                    <div className="h-4 w-1/2 bg-white/20"></div>
                </div>
            </div>
        </>
    )
}

export default function Blog() {
    const [query, setQuery] = useState<string>();
    const { items, getAll, loading } = useBlog();

    useEffect(() => {
        getAll();
    }, []);

    const filterBlog = items.filter(blog => blog.title.toLowerCase().includes(query?.toLowerCase() ?? ''))

    return (
        <PublicLayout title="Blog" icon="pixel:newspaper">
            <div className="md:w-96 mx-auto">
                <Input
                    label="Filter"
                    placeholder='Cari Judul Blog...'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    name="Cari"
                />
            </div>
            <div className="mt-10 flex flex-wrap w-full items-center justify-center gap-8">
                {loading && <BlogSkeleton />}
                {!loading && filterBlog.length === 0 && (
                    <p className="text-white text-2xl">No blog posts available.</p>
                )}
                {!loading && filterBlog.length > 0 && filterBlog.map((blog, index) => (
                    <BlogCard
                        key={index}
                        blog={blog}
                    />
                ))}
            </div>
        </PublicLayout>
    )
}
