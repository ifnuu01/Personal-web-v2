import { BrowserRouter, Routes, Route } from "react-router"
import Navbar from "./components/Navbar"
import About from "./pages/public/About"
import Project from "./pages/public/Project"
import Achivement from "./pages/public/Achivement"
import Blog from "./pages/public/Blog"
import Resume from "./pages/public/Resume"
import { AnimatePresence } from 'framer-motion';
import withTransition from "./utils/withTransition"

const AboutWithTransition = withTransition(About);
const ProjectWithTransition = withTransition(Project);
const AchivementWithTransition = withTransition(Achivement);
const BlogWithTransition = withTransition(Blog);
const ResumeWithTransition = withTransition(Resume);

function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <div className="flex flex-col min-h-screen bg-pattern">
          <Navbar />
          <Routes>
            <Route path="/" element={<AboutWithTransition />} />
            <Route path="/project" element={<ProjectWithTransition />} />
            <Route path="/achivement" element={<AchivementWithTransition />} />
            <Route path="/blog" element={<BlogWithTransition />} />
            <Route path="/resume" element={<ResumeWithTransition />} />
          </Routes>
        </div>
      </AnimatePresence>
    </BrowserRouter>
  )
}

export default App
