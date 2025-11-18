import Profile from "../../components/Profile";
import Tech from "../../components/Tech";
import Timeline from "../../components/Timeline";
import PublicLayout from "../../layouts/PublicLayout";

export default function About() {
    return (
        <PublicLayout>
            <Profile />
            <Timeline />
            <Tech />
        </PublicLayout>
    )
}
