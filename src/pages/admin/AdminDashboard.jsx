import { useEffect, useState } from "react";

import {
    Briefcase,
    FolderKanban,
    FileText,
    MessageSquare
} from "lucide-react";

import api from "../../services/api";

function AdminDashboard() {

    const [stats, setStats] = useState(null);

    useEffect(() => {

        api.get("/dashboard")
            .then((response) => {
                setStats(response.data);
            })
            .catch((error) => {
                console.error(error);
            });

    }, []);

    return (
        <div className="admin-page">

            <div className="admin-page-header">

                <div>

                    <span className="eyebrow">
                        Overview
                    </span>

                    <h1>
                        لوحة التحكم
                    </h1>

                    <p>
                        نظرة عامة على محتوى وبيانات الموقع.
                    </p>

                </div>

            </div>


            <div className="admin-stats-grid">

                <div className="admin-stat-card">

                    <div className="admin-stat-icon">
                        <Briefcase />
                    </div>

                    <span>
                        الخدمات
                    </span>

                    <strong>
                        {stats?.services ?? 0}
                    </strong>

                </div>


                <div className="admin-stat-card">

                    <div className="admin-stat-icon">
                        <FolderKanban />
                    </div>

                    <span>
                        المشاريع
                    </span>

                    <strong>
                        {stats?.projects ?? 0}
                    </strong>

                </div>


                <div className="admin-stat-card">

                    <div className="admin-stat-icon">
                        <FileText />
                    </div>

                    <span>
                        المحتوى
                    </span>

                    <strong>
                        {stats?.content ?? 0}
                    </strong>

                </div>


                <div className="admin-stat-card">

                    <div className="admin-stat-icon">
                        <MessageSquare />
                    </div>

                    <span>
                        الرسائل
                    </span>

                    <strong>
                        {stats?.messages ?? 0}
                    </strong>

                </div>

            </div>


            <div className="admin-welcome-card">

                <h2>
                    إدارة الموقع
                </h2>

                <p>
                    استخدم القائمة الجانبية لإدارة الخدمات
                    والمشاريع ومحتوى الموقع والرسائل.
                </p>

            </div>

        </div>
    );
}

export default AdminDashboard;