import { useEffect, useState } from "react";

import {
    MessageCircle,
    Code2,
    Smartphone,
    LayoutDashboard,
    Megaphone,
    Share2,
    BarChart3,
    ArrowLeft,
    ExternalLink
} from "lucide-react";

import api from "../services/api";
import siteConfig from "../config/site";


function getServiceIcon(title = "") {

    if (title.includes("مواقع")) {
        return <Code2 size={26} />;
    }

    if (title.includes("تطبيق")) {
        return <Smartphone size={26} />;
    }

    if (
        title.includes("أنظمة") ||
        title.includes("لوحات")
    ) {
        return <LayoutDashboard size={26} />;
    }

    if (
        title.includes("تسويق") ||
        title.includes("متاجر")
    ) {
        return <Megaphone size={26} />;
    }

    if (
        title.includes("سوشيال") ||
        title.includes("UI")
    ) {
        return <Share2 size={26} />;
    }

    if (
        title.includes("تحليل") ||
        title.includes("أداء")
    ) {
        return <BarChart3 size={26} />;
    }

    return <Code2 size={26} />;
}


function Home() {

    const [services, setServices] = useState([]);
    const [projects, setProjects] = useState([]);

    useEffect(() => {

        api.get("/services")
            .then((response) => {
                setServices(response.data);
            })
            .catch((error) => {
                console.error(
                    "Failed to load services:",
                    error
                );
            });

        api.get("/projects")
            .then((response) => {

                setProjects(
                    response.data.slice(0, 3)
                );

            })
            .catch((error) => {

                console.error(
                    "Failed to load projects:",
                    error
                );

            });

    }, []);


    return (
        <div>

            {/* =========================
                Hero
            ========================= */}

            <section className="home-hero">

                <div className="container">

                    <div className="hero-badge">
                        <span className="logo-mark">
                            N
                        </span>

                        <span>
                            {siteConfig.name}
                        </span>

                        <span>
                            حلول رقمية لنمو أعمالك
                        </span>
                    </div>


                    <h1>

                        نحوّل أفكارك

                        <br />

                        <span>
                            إلى حلول رقمية حقيقية
                        </span>

                    </h1>


                    <p>

                        في {siteConfig.name} نساعد الشركات والأعمال
                        على بناء مواقع وتطبيقات وأنظمة رقمية
                        احترافية مصممة لتحقيق نتائج حقيقية.

                    </p>


                    <div className="hero-actions">

                        <a
                            href="/contact"
                            className="btn btn-primary"
                        >
                            ابدأ مشروعك
                            <ArrowLeft size={18} />
                        </a>


                        <a
                            href="/projects"
                            className="btn btn-secondary"
                        >
                            استكشف أعمالنا
                            <ExternalLink size={17} />
                        </a>

                    </div>

                </div>

            </section>


            {/* =========================
                Stats
            ========================= */}

            <section className="stats-section">

                <div className="container">

                    <div className="stats-grid">

                        <div className="stat-item">

                            <strong>
                                {projects.length}+
                            </strong>

                            <span>
                                مشاريع في معرض الأعمال
                            </span>

                        </div>


                        <div className="stat-item">

                            <strong>
                                {services.length}+
                            </strong>

                            <span>
                                حلول وخدمات رقمية
                            </span>

                        </div>


                        <div className="stat-item">

                            <strong>
                                100%
                            </strong>

                            <span>
                                تصميم متجاوب
                            </span>

                        </div>


                        <div className="stat-item">

                            <strong>
                                24/7
                            </strong>

                            <span>
                                جاهزية رقمية
                            </span>

                        </div>

                    </div>

                </div>

            </section>


            {/* =========================
                Services
            ========================= */}

            <section className="services-section section">

                <div className="container">

                    <div className="section-heading">

                        <span className="eyebrow">
                            ماذا نقدم؟
                        </span>


                        <h2>

                            حلول رقمية متكاملة

                            <br />

                            لنمو أعمالك

                        </h2>


                        <p>

                            نطوّر حلولًا رقمية تجمع بين التصميم
                            الحديث والأداء العالي وسهولة الاستخدام.

                        </p>

                    </div>


                    <div className="services-grid">

                        {services.length > 0 ? (

                            services.map((service) => (

                                <div
                                    className="service-card"
                                    key={service.id}
                                >

                                    <div className="service-icon">

                                        {getServiceIcon(
                                            service.title
                                        )}

                                    </div>


                                    <h3>
                                        {service.title}
                                    </h3>


                                    <p>
                                        {service.description}
                                    </p>


                                    <a href="/services">

                                        اكتشف المزيد

                                        <ArrowLeft
                                            size={16}
                                        />

                                    </a>

                                </div>

                            ))

                        ) : (

                            <div className="empty-state">

                                <h3>
                                    خدماتنا الرقمية
                                </h3>

                                <p>
                                    سيتم عرض الخدمات هنا.
                                </p>

                            </div>

                        )}

                    </div>

                </div>

            </section>


            {/* =========================
                Projects
            ========================= */}

            <section className="projects-section section">

                <div className="container">

                    <div className="section-heading">

                        <span className="eyebrow">
                            أعمالنا
                        </span>


                        <h2>

                            مشاريع نفخر

                            <br />

                            بتنفيذها

                        </h2>


                        <p>

                            نماذج من الحلول الرقمية الموجودة
                            في معرض أعمال {siteConfig.name}.

                        </p>

                    </div>


                    <div className="projects-grid">

                        {projects.map((project) => (

                            <article
                                className="project-card"
                                key={project.id}
                            >

                                <div className="project-image">

                                    {project.image ? (

                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            loading="lazy"
                                        />

                                    ) : (

                                        <div className="project-image-placeholder">

                                            {project.title}

                                        </div>

                                    )}

                                </div>


                                <div className="project-content">

                                    <span className="project-category">
                                        مشروع رقمي
                                    </span>


                                    <h3>
                                        {project.title}
                                    </h3>


                                    <p>
                                        {project.description}
                                    </p>


                                    <a href="/projects">

                                        مشاهدة المشروع

                                        <ArrowLeft
                                            size={16}
                                        />

                                    </a>

                                </div>

                            </article>

                        ))}

                    </div>


                    <div className="projects-more">

                        <a
                            href="/projects"
                            className="btn btn-secondary"
                        >

                            مشاهدة جميع المشاريع

                            <ArrowLeft size={18} />

                        </a>

                    </div>

                </div>

            </section>


            {/* =========================
                Why Us
            ========================= */}

            <section className="why-us-section section">

                <div className="container">

                    <div className="why-us-grid">

                        <div className="why-us-content">

                            <span className="eyebrow">
                                لماذا NovaTech؟
                            </span>


                            <h2>

                                لا نقدم خدمة فقط،

                                <br />

                                نبني حلولًا رقمية

                            </h2>


                            <p>

                                نبدأ بفهم احتياجات مشروعك،
                                ثم نحولها إلى تجربة رقمية
                                واضحة وسريعة وقابلة للتطوير.

                            </p>


                            <a
                                href="/contact"
                                className="btn btn-primary"
                            >
                                تحدث معنا
                                <ArrowLeft size={18} />
                            </a>

                        </div>


                        <div className="why-us-features">

                            <div className="why-us-item">

                                <div className="why-us-number">
                                    01
                                </div>

                                <div>

                                    <h3>
                                        حلول مخصصة
                                    </h3>

                                    <p>
                                        نصمم الحلول بناءً على
                                        احتياجات وأهداف كل مشروع.
                                    </p>

                                </div>

                            </div>


                            <div className="why-us-item">

                                <div className="why-us-number">
                                    02
                                </div>

                                <div>

                                    <h3>
                                        تصميم احترافي
                                    </h3>

                                    <p>
                                        واجهات عصرية وسهلة الاستخدام
                                        ومتوافقة مع جميع الشاشات.
                                    </p>

                                </div>

                            </div>


                            <div className="why-us-item">

                                <div className="why-us-number">
                                    03
                                </div>

                                <div>

                                    <h3>
                                        أداء وسرعة
                                    </h3>

                                    <p>
                                        نهتم ببناء مواقع وتطبيقات
                                        سريعة وقابلة للتوسع.
                                    </p>

                                </div>

                            </div>


                            <div className="why-us-item">

                                <div className="why-us-number">
                                    04
                                </div>

                                <div>

                                    <h3>
                                        تجربة مستخدم
                                    </h3>

                                    <p>
                                        نركز على جعل تجربة المستخدم
                                        بسيطة وواضحة ومريحة.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =========================
                Contact CTA
            ========================= */}

            <section className="contact-cta-section section">

                <div className="container">

                    <div className="contact-cta">

                        <div className="contact-cta-content">

                            <span className="eyebrow">
                                هل لديك مشروع؟
                            </span>


                            <h2>

                                دعنا نحول فكرتك

                                <br />

                                إلى واقع رقمي

                            </h2>


                            <p>

                                أخبرنا عن فكرتك وسنتواصل معك
                                لمناقشة الحل المناسب لمشروعك.

                            </p>

                        </div>


                        <div className="contact-cta-actions">

                            <a
                                href="/contact"
                                className="btn btn-primary"
                            >
                                ابدأ مشروعك
                                <ArrowLeft size={18} />
                            </a>


                            <a
                                href={`https://wa.me/${siteConfig.whatsapp}`}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-secondary"
                            >
                                تواصل عبر واتساب
                                <MessageCircle size={18} />
                            </a>

                        </div>

                    </div>

                </div>

            </section>


            {/* =========================
                Footer
            ========================= */}

            <footer className="footer">

                <div className="container">

                    <div className="footer-grid">


                        {/* Brand */}

                        <div className="footer-brand">

                            <a
                                href="/"
                                className="footer-logo"
                            >

                                <span className="logo-mark">
                                    N
                                </span>


                                <span>

                                    <strong>
                                        {siteConfig.name}
                                    </strong>

                                    <small>
                                        {siteConfig.tagline}
                                    </small>

                                </span>

                            </a>


                            <p>

                                نحول الأفكار إلى حلول رقمية
                                احترافية تساعد الأعمال على
                                النمو والتطور.

                            </p>

                        </div>


                        {/* Links */}

                        <div className="footer-column">

                            <h3>
                                روابط سريعة
                            </h3>


                            <a href="/">
                                الرئيسية
                            </a>


                            <a href="/services">
                                خدماتنا
                            </a>


                            <a href="/projects">
                                أعمالنا
                            </a>


                            <a href="/about">
                                من نحن
                            </a>


                            <a href="/contact">
                                تواصل معنا
                            </a>

                        </div>


                        {/* Services */}

                        <div className="footer-column">

                            <h3>
                                خدماتنا
                            </h3>


                            <a href="/services">
                                تطوير المواقع
                            </a>


                            <a href="/services">
                                تطبيقات الويب
                            </a>


                            <a href="/services">
                                المتاجر الإلكترونية
                            </a>


                            <a href="/services">
                                الأنظمة ولوحات التحكم
                            </a>

                        </div>


                        {/* Contact */}

                        <div className="footer-column">

                            <h3>
                                تواصل معنا
                            </h3>


                            <a
                                href={`mailto:${siteConfig.email}`}
                            >
                                {siteConfig.email}
                            </a>


                            <a
                                href={`tel:${siteConfig.phone}`}
                            >
                                {siteConfig.phone}
                            </a>


                            <a
                                href={`https://wa.me/${siteConfig.whatsapp}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                واتساب
                            </a>


                            <span>
                                {siteConfig.location}
                            </span>

                        </div>

                    </div>


                    <div className="footer-bottom">

                        <p>

                            © 2026 {siteConfig.name}.
                            جميع الحقوق محفوظة.

                        </p>


                        <p>
                            {siteConfig.tagline}
                        </p>

                    </div>

                </div>

            </footer>


            {/* =========================
                Floating WhatsApp
            ========================= */}

            <a
                href={`https://wa.me/${siteConfig.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="whatsapp-float"
                aria-label="تواصل معنا عبر واتساب"
            >

                <MessageCircle
                    size={25}
                    strokeWidth={2.3}
                />

            </a>

        </div>
    );
}


export default Home;