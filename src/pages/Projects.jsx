import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

import api from "../services/api";

function Projects() {

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        api.get("/projects")
            .then((response) => {
                setProjects(response.data);
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
                        أعمالنا
                    </span>

                    <h1>
                        مشاريع نفخر
                        <br />
                        بتنفيذها
                    </h1>

                    <p>
                        مجموعة من المشاريع والحلول الرقمية
                        التي تم تنفيذها باهتمام بالتفاصيل.
                    </p>

                </div>

            </section>


            <section className="section">

                <div className="container">

                    {loading ? (

                        <div className="page-loader-small">
                            <div className="loader"></div>
                        </div>

                    ) : projects.length === 0 ? (

                        <div className="empty-state">

                            <h2>
                                لا توجد مشاريع مضافة حاليًا
                            </h2>

                            <p>
                                يمكنك إضافة المشاريع من لوحة التحكم.
                            </p>

                        </div>

                    ) : (

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
                                            />
                                        ) : (
                                            <div className="project-image-placeholder">
                                                مشروع
                                            </div>
                                        )}

                                    </div>

                                    <div className="project-content">

                                        <h3>
                                            {project.title}
                                        </h3>

                                        <p>
                                            {project.description}
                                        </p>

                                        {project.link && (
                                            <a
                                                href={project.link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="project-link"
                                            >
                                                مشاهدة المشروع
                                                <ExternalLink size={16} />
                                            </a>
                                        )}

                                    </div>

                                </article>

                            ))}

                        </div>

                    )}

                </div>

            </section>

        </main>
    );
}

export default Projects;