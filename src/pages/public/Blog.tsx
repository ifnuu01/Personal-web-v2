import BlogCard from "../../components/BlogCard";
import PublicLayout from "../../layouts/PublicLayout";

export default function Blog() {
    return (
        <PublicLayout title="Blog" icon="pixel:newspaper">
            <div className="mt-10 flex flex-wrap w-full items-center justify-center gap-8">
                <BlogCard />
            </div>
        </PublicLayout>
    )
}
