import { useEffect, useState } from "react";

import {
    Plus,
    Trash2,
    Edit3,
    X,
    Save
} from "lucide-react";

import api from "../../services/api";

function AdminServices() {

    const [services, setServices] = useState([]);

    const [loading, setLoading] = useState(true);

    const [modal, setModal] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        title: "",
        description: ""
    });

    async function loadServices() {

        try {

            const response =
                await api.get("/services");

            setServices(response.data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }
    }

    useEffect(() => {

        loadServices();

    }, []);

    function openCreate() {

        setEditingId(null);

        setForm({
            title: "",
            description: ""
        });

        setModal(true);
    }

    function openEdit(service) {

        setEditingId(service.id);

        setForm({
            title: service.title,
            description: service.description || ""
        });

        setModal(true);
    }

    async function handleSubmit(event) {

        event.preventDefault();

        try {

            if (editingId) {

                await api.put(
                    `/services/${editingId}`,
                    form
                );

            } else {

                await api.post(
                    "/services",
                    form
                );

            }

            setModal(false);

            await loadServices();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "حدث خطأ أثناء حفظ الخدمة"
            );

        }
    }

    async function handleDelete(id) {

        if (
            !window.confirm(
                "هل أنت متأكد من حذف هذه الخدمة؟"
            )
        ) {
            return;
        }

        try {

            await api.delete(
                `/services/${id}`
            );

            await loadServices();

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
                        Services
                    </span>

                    <h1>
                        الخدمات
                    </h1>

                    <p>
                        إدارة الخدمات الظاهرة في الموقع.
                    </p>

                </div>


                <button
                    className="btn btn-primary"
                    onClick={openCreate}
                >
                    <Plus size={18} />
                    إضافة خدمة
                </button>

            </div>


            <div className="admin-table-card">

                {loading ? (

                    <div className="admin-empty">
                        جاري التحميل...
                    </div>

                ) : services.length === 0 ? (

                    <div className="admin-empty">

                        <h3>
                            لا توجد خدمات
                        </h3>

                        <p>
                            أضف أول خدمة للموقع.
                        </p>

                    </div>

                ) : (

                    <div className="admin-table-wrapper">

                        <table className="admin-table">

                            <thead>
                                <tr>
                                    <th>الخدمة</th>
                                    <th>الوصف</th>
                                    <th>الإجراءات</th>
                                </tr>
                            </thead>

                            <tbody>

                                {services.map((service) => (

                                    <tr key={service.id}>

                                        <td>
                                            <strong>
                                                {service.title}
                                            </strong>
                                        </td>

                                        <td>
                                            {service.description || "-"}
                                        </td>

                                        <td>

                                            <div className="table-actions">

                                                <button
                                                    onClick={() =>
                                                        openEdit(service)
                                                    }
                                                    className="edit-btn"
                                                >
                                                    <Edit3 size={16} />
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            service.id
                                                        )
                                                    }
                                                    className="delete-btn"
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
                                    ? "تعديل الخدمة"
                                    : "إضافة خدمة"
                                }
                            </h2>

                            <button
                                onClick={() => setModal(false)}
                            >
                                <X />
                            </button>

                        </div>


                        <form
                            onSubmit={handleSubmit}
                            className="admin-form"
                        >

                            <div className="form-group">

                                <label>
                                    اسم الخدمة
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
                                    rows="5"
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


                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                <Save size={18} />
                                حفظ
                            </button>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default AdminServices;