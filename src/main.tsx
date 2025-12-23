import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import withTransition from './utils/withTransition.tsx'
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
import About from './pages/public/About.tsx'
import Project from './pages/public/Project.tsx'
import Achievement from './pages/public/Achievement.tsx'
import Blog from './pages/public/Blog.tsx'
import Resume from './pages/public/Resume.tsx'

const AboutWithTransition = withTransition(About);
const ProjectWithTransition = withTransition(Project);
const AchievementWithTransition = withTransition(Achievement);
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <AboutWithTransition /> },
      { path: "project", element: <ProjectWithTransition /> },
      { path: "achievement", element: <AchievementWithTransition /> },
      { path: "blog", element: <BlogWithTransition /> },
      { path: "resume", element: <ResumeWithTransition /> },

      {
        element: <GuestRoute />,
        children: [
          { path: 'login', element: <LoginWithTransition /> }
        ]
      },

      {
        element: <ProtectedRoute />,
        children: [
          { path: "dashboard", element: <DashboardWithTransition /> },
          { path: "dashboard/category", element: <CategoryWithTransition /> },
          { path: "dashboard/tech", element: <TechWithTransition /> },
          { path: "dashboard/experience", element: <ExperienceWithTransition /> },
          { path: "dashboard/certificate", element: <CertificateWithTransition /> },
          { path: "dashboard/project", element: <ProjectManageWithTransition /> },
          { path: "dashboard/blog", element: <BlogManageWithTransition /> },
        ]
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
