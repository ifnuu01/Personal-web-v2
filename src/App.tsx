import { BrowserRouter, Routes, Route } from "react-router"
import Navbar from "./components/Navbar"
import About from "./pages/public/About"
import Project from "./pages/public/Project"
import Achivement from "./pages/public/Achivement"
import Blog from "./pages/public/Blog"
import Resume from "./pages/public/Resume"

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-pattern">
        <Navbar />
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/project" element={<Project />} />
          <Route path="/achivement" element={<Achivement />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/resume" element={<Resume />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
