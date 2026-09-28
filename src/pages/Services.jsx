import { useEffect, useState } from "react";
import {
    Code2,
    Smartphone,
    LayoutDashboard,
    Megaphone,
    Share2,
    BarChart3
} from "lucide-react";

import api from "../services/api";

function getServiceIcon(title = "") {

    if (title.includes("مواقع")) {
        return <Code2 size={28} />;
    }

    if (title.includes("تطبيق")) {
        return <Smartphone size={28} />;
    }

    if (
        title.includes("أنظمة") ||
        title.includes("لوحات")
    ) {
        return <LayoutDashboard size={28} />;
    }

    if (title.includes("تسويق")) {
        return <Megaphone size={28} />;
    }

    if (title.includes("سوشيال")) {
        return <Share2 size={28} />;
    }

    if (
        title.includes("تحليل") ||
        title.includes("أداء")
    ) {
        return <BarChart3 size={28} />;
    }

    return <Code2 size={28} />;
}

function Services() {

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        api.get("/services")
            .then((response) => {
                setServices(response.data);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });

    }, []);

    return (
        <main>

            <section className="page-hero">

                <div className="container">

                    <span className="eyebrow">
                        خدماتنا
                    </span>

                    <h1>
                        حلول رقمية مصممة
                        <br />
                        لتحقيق نتائج حقيقية
                    </h1>

                    <p>
                        نقدم خدمات تطوير وتصميم رقمية
                        تساعد الشركات على بناء حضور قوي
                        وتحسين أعمالها.
                    </p>

                </div>

            </section>


            <section className="section">

                <div className="container">

                    {loading ? (

                        <div className="page-loader-small">
                            <div className="loader"></div>
                        </div>

                    ) : services.length === 0 ? (

                        <div className="empty-state">

                            <h2>
                                لا توجد خدمات مضافة حاليًا
                            </h2>

                            <p>
                                يمكنك إضافة الخدمات من لوحة التحكم.
                            </p>

                        </div>

                    ) : (

                        <div className="services-grid">

                            {services.map((service) => (

                                <article
                                    className="service-card"
                                    key={service.id}
                                >

                                    <div className="service-icon">
                                        {getServiceIcon(service.title)}
                                    </div>

                                    <h3>
                                        {service.title}
                                    </h3>

                                    <p>
                                        {service.description}
                                    </p>

                                </article>

                            ))}

                        </div>

                    )}

                </div>

            </section>

        </main>
    );
}

export default Services;