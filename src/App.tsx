import { BrowserRouter, Routes, Route } from "react-router"
import Navbar from "./components/Navbar"
import About from "./pages/public/About"
import Project from "./pages/public/Project"
import Achivement from "./pages/public/Achivement"
import Blog from "./pages/public/Blog"
import Resume from "./pages/public/Resume"
import { AnimatePresence } from 'framer-motion';
import withTransition from "./utils/withTransition"
import Login from "./pages/auth/Login";
import Dashboard from "./pages/private/Dashboard";
import Category from "./pages/private/Category";
import Tech from "./pages/private/Tech";
import Experience from "./pages/private/Experience";
import Certificate from "./pages/private/Certificate";
import ProjectManage from "./pages/private/Project";
import BlogManage from "./pages/private/Blog"
import GuestRoute from "./components/GuestRoute"
import ProtectedRoute from "./components/ProtectedRoute"

const AboutWithTransition = withTransition(About);
const ProjectWithTransition = withTransition(Project);
const AchivementWithTransition = withTransition(Achivement);
const BlogWithTransition = withTransition(Blog);
const ResumeWithTransition = withTransition(Resume);
const LoginWithTransition = withTransition(Login);
const DashboardWithTransition = withTransition(Dashboard);
const CategoryWithTransition = withTransition(Category);
const TechWithTransition = withTransition(Tech);
const ExperienceWithTransition = withTransition(Experience);
const CertificateWithTransition = withTransition(Certificate);
const ProjectManageWithTransition = withTransition(ProjectManage);
const BlogManageWithTransition = withTransition(BlogManage);


function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <div className="flex flex-col min-h-screen bg-pattern">
          <Navbar />
          <Routes>
            {/* Public */}
            <Route path="/" element={<AboutWithTransition />} />
            <Route path="/project" element={<ProjectWithTransition />} />
            <Route path="/achivement" element={<AchivementWithTransition />} />
            <Route path="/blog" element={<BlogWithTransition />} />
            <Route path="/resume" element={<ResumeWithTransition />} />

            {/* Auth */}
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginWithTransition />} />
            </Route>

            {/* Private */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardWithTransition />} />
              <Route path="/dashboard/category" element={<CategoryWithTransition />} />
              <Route path="/dashboard/tech" element={<TechWithTransition />} />
              <Route path="/dashboard/experience" element={<ExperienceWithTransition />} />
              <Route path="/dashboard/certificate" element={<CertificateWithTransition />} />
              <Route path="/dashboard/project" element={<ProjectManageWithTransition />} />
              <Route path="/dashboard/blog" element={<BlogManageWithTransition />} />
            </Route>
          </Routes>
        </div>
      </AnimatePresence>
    </BrowserRouter>
  )
}

export default App
