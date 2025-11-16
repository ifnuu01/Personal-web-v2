import PrivateLayout from "../../layouts/PrivateLayout";

export default function Dashboard() {
    return (
        <PrivateLayout>
            <div className="flex justify-center items-center flex-col mt-20 text-white bg-white/10 py-20">
                <h1 className="text-6xl mb-5">Dashboard</h1>
                <p className="text-3xl text-center">Welcome to the dashboard Ifnu Umar!</p>
            </div>
        </PrivateLayout>
    )
}
