import "./App.css";

import {
    Routes,
    Route
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Services from "./pages/Services";
import Projects from "./pages/Projects";
import About from "./pages/About";
import Contact from "./pages/Contact";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminServices from "./pages/admin/AdminServices";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminContent from "./pages/admin/AdminContent";
import AdminMessages from "./pages/admin/AdminMessages";

function App() {

    return (
        <>
            <Navbar />

            <Routes>

                {/* Public */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/services"
                    element={<Services />}
                />

                <Route
                    path="/projects"
                    element={<Projects />}
                />

                <Route
                    path="/about"
                    element={<About />}
                />

                <Route
                    path="/contact"
                    element={<Contact />}
                />


                {/* Admin */}

                <Route
                    path="/admin/login"
                    element={<AdminLogin />}
                />

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/services"
                    element={
                        <ProtectedRoute>
                            <AdminServices />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/projects"
                    element={
                        <ProtectedRoute>
                            <AdminProjects />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/content"
                    element={
                        <ProtectedRoute>
                            <AdminContent />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/messages"
                    element={
                        <ProtectedRoute>
                            <AdminMessages />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </>
    );
}

export default App;