import Button from "../../components/Button";
import PublicLayout from "../../layouts/PublicLayout";

export default function About() {
    return (
        <PublicLayout>
            <div className="md:pt-10 flex flex-col md:flex-row justify-between items-center gap-20">
                <div id="profile" className="relative md:order-2">
                    <div className="absolute py-4 px-8 bg-white left-1 top-10">
                        <h1 className="font-bold text-2xl">Code</h1>
                    </div>
                    <img src="/me.png" alt="Profile Picture" className="bg-white/10 rounded-full px-4" />
                </div>
                <div id="info" className="text-white space-y-4">
                    <h1 className="text-5xl">Fullstack Developer</h1>
                    <p className="text-lg max-w-3xl">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Neque sed error veniam. Perferendis error porro ad dolore, suscipit, ratione dolorem officiis facilis deserunt aperiam minus incidunt dolor, possimus veritatis pariatur blanditiis asperiores sit. Tempora, repellat nihil ut amet commodi sed.</p>
                    <Button>
                        <span className="text-3xl">Contact Me</span>
                    </Button>
                </div>
            </div>
        </PublicLayout>
    )
}
