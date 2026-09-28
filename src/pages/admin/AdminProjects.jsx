import { useEffect, useState } from "react";

import {
    Plus,
    Trash2,
    Edit3,
    X,
    Save
} from "lucide-react";

import api from "../../services/api";

function AdminProjects() {

    const [projects, setProjects] = useState([]);

    const [modal, setModal] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        title: "",
        description: "",
        image: "",
        link: ""
    });

    async function loadProjects() {

        const response =
            await api.get("/projects");

        setProjects(response.data);
    }

    useEffect(() => {

        loadProjects()
            .catch(console.error);

    }, []);

    function openCreate() {

        setEditingId(null);

        setForm({
            title: "",
            description: "",
            image: "",
            link: ""
        });

        setModal(true);
    }

    function openEdit(project) {

        setEditingId(project.id);

        setForm({
            title: project.title,
            description: project.description || "",
            image: project.image || "",
            link: project.link || ""
        });

        setModal(true);
    }

    async function handleSubmit(event) {

        event.preventDefault();

        try {

            if (editingId) {

                await api.put(
                    `/projects/${editingId}`,
                    form
                );

            } else {

                await api.post(
                    "/projects",
                    form
                );

            }

            setModal(false);

            await loadProjects();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "حدث خطأ أثناء الحفظ"
            );

        }
    }

    async function handleDelete(id) {

        if (
            !window.confirm(
                "هل أنت متأكد من حذف المشروع؟"
            )
        ) {
            return;
        }

        try {

            await api.delete(
                `/projects/${id}`
            );

            await loadProjects();

        } catch (error) {

            console.error(error);

            alert("حدث خطأ أثناء الحذف");

        }
    }

    return (
        <div className="admin-page">

            <div className="admin-page-header">

                <div>

                    <span className="eyebrow">
                        Projects
                    </span>

                    <h1>
                        المشاريع
                    </h1>

                    <p>
                        إدارة المشاريع والأعمال المعروضة.
                    </p>

                </div>


                <button
                    className="btn btn-primary"
                    onClick={openCreate}
                >
                    <Plus size={18} />
                    إضافة مشروع
                </button>

            </div>


            <div className="admin-table-card">

                {projects.length === 0 ? (

                    <div className="admin-empty">

                        <h3>
                            لا توجد مشاريع
                        </h3>

                        <p>
                            أضف أول مشروع.
                        </p>

                    </div>

                ) : (

                    <div className="admin-table-wrapper">

                        <table className="admin-table">

                            <thead>

                                <tr>
                                    <th>المشروع</th>
                                    <th>الوصف</th>
                                    <th>الرابط</th>
                                    <th>الإجراءات</th>
                                </tr>

                            </thead>

                            <tbody>

                                {projects.map((project) => (

                                    <tr key={project.id}>

                                        <td>
                                            <strong>
                                                {project.title}
                                            </strong>
                                        </td>

                                        <td>
                                            {project.description || "-"}
                                        </td>

                                        <td>
                                            {project.link || "-"}
                                        </td>

                                        <td>

                                            <div className="table-actions">

                                                <button
                                                    className="edit-btn"
                                                    onClick={() =>
                                                        openEdit(project)
                                                    }
                                                >
                                                    <Edit3 size={16} />
                                                </button>

                                                <button
                                                    className="delete-btn"
                                                    onClick={() =>
                                                        handleDelete(
                                                            project.id
                                                        )
                                                    }
                                                >
                                                    <Trash2 size={16} />
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {modal && (

                <div className="admin-modal-overlay">

                    <div className="admin-modal">

                        <div className="admin-modal-header">

                            <h2>
                                {editingId
                                    ? "تعديل المشروع"
                                    : "إضافة مشروع"
                                }
                            </h2>

                            <button
                                onClick={() =>
                                    setModal(false)
                                }
                            >
                                <X />
                            </button>

                        </div>


                        <form
                            className="admin-form"
                            onSubmit={handleSubmit}
                        >

                            <div className="form-group">

                                <label>
                                    اسم المشروع
                                </label>

                                <input
                                    value={form.title}
                                    onChange={(event) =>
                                        setForm({
                                            ...form,
                                            title:
                                                event.target.value
                                        })
                                    }
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    الوصف
                                </label>

                                <textarea
                                    rows="4"
                                    value={form.description}
                                    onChange={(event) =>
                                        setForm({
                                            ...form,
                                            description:
                                                event.target.value
                                        })
                                    }
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    رابط الصورة
                                </label>

                                <input
                                    value={form.image}
                                    onChange={(event) =>
                                        setForm({
                                            ...form,
                                            image:
                                                event.target.value
                                        })
                                    }
                                    placeholder="https://..."
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    رابط المشروع
                                </label>

                                <input
                                    value={form.link}
                                    onChange={(event) =>
                                        setForm({
                                            ...form,
                                            link:
                                                event.target.value
                                        })
                                    }
                                    placeholder="https://..."
                                />

                            </div>


                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                <Save size={18} />
                                حفظ المشروع
                            </button>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default AdminProjects;