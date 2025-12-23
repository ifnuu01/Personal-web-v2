import { Outlet } from "react-router"
import Navbar from "./components/Navbar"
import { AnimatePresence } from 'framer-motion';
import Footer from "./components/Footer"
import ScrollToTop from "./components/ScrollToTop"

function App() {
  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <div className="flex flex-col min-h-screen bg-pattern">
          <Navbar />
          <Outlet />
          <Footer />
        </div>
      </AnimatePresence>
    </>
  )
}

export default App
