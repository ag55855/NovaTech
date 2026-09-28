import {
    NavLink,
    useNavigate
} from "react-router-dom";

import {
    LayoutDashboard,
    Briefcase,
    FolderKanban,
    FileText,
    MessageSquare,
    LogOut,
    ExternalLink
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function AdminLayout({ children }) {

    const { admin, logout } = useAuth();

    const navigate = useNavigate();

    function handleLogout() {

        logout();

        navigate("/admin/login");

    }

    return (
        <div className="admin-layout">

            <aside className="admin-sidebar">

                <div className="admin-brand">

                    <div className="logo-mark">
                        C
                    </div>

                    <div>
                        <strong>
                            Company
                        </strong>

                        <span>
                            Dashboard
                        </span>
                    </div>

                </div>


                <nav className="admin-nav">

                    <NavLink to="/admin">
                        <LayoutDashboard size={19} />
                        الرئيسية
                    </NavLink>

                    <NavLink to="/admin/services">
                        <Briefcase size={19} />
                        الخدمات
                    </NavLink>

                    <NavLink to="/admin/projects">
                        <FolderKanban size={19} />
                        المشاريع
                    </NavLink>

                    <NavLink to="/admin/content">
                        <FileText size={19} />
                        محتوى الموقع
                    </NavLink>

                    <NavLink to="/admin/messages">
                        <MessageSquare size={19} />
                        الرسائل
                    </NavLink>

                </nav>


                <div className="admin-sidebar-bottom">

                    <a
                        href="/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <ExternalLink size={18} />
                        زيارة الموقع
                    </a>


                    <button onClick={handleLogout}>
                        <LogOut size={18} />
                        تسجيل الخروج
                    </button>

                </div>

            </aside>


            <div className="admin-main">

                <header className="admin-topbar">

                    <div>
                        <span>
                            لوحة التحكم
                        </span>

                        <strong>
                            {admin?.name}
                        </strong>
                    </div>

                </header>


                <div className="admin-content">
                    {children}
                </div>

            </div>

        </div>
    );
}

export default AdminLayout;