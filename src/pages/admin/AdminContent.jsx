import { useEffect, useState } from "react";

import {
    Save
} from "lucide-react";

import api from "../../services/api";

function AdminContent() {

    const [content, setContent] = useState([]);

    const [loading, setLoading] = useState(true);

    async function loadContent() {

        try {

            const response =
                await api.get("/content");

            setContent(response.data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }
    }

    useEffect(() => {

        loadContent();

    }, []);

    function updateItem(
        index,
        field,
        value
    ) {

        const updated = [...content];

        updated[index] = {
            ...updated[index],
            [field]: value
        };

        setContent(updated);
    }

    async function saveItem(item) {

        try {

            await api.put(
                `/content/${item.section}`,
                {
                    title: item.title,
                    content: item.content
                }
            );

            alert("تم حفظ المحتوى بنجاح");

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "حدث خطأ أثناء الحفظ"
            );

        }
    }

    return (
        <div className="admin-page">

            <div className="admin-page-header">

                <div>

                    <span className="eyebrow">
                        Content
                    </span>

                    <h1>
                        محتوى الموقع
                    </h1>

                    <p>
                        تعديل النصوص الأساسية للموقع.
                    </p>

                </div>

            </div>


            {loading ? (

                <div className="admin-empty">
                    جاري التحميل...
                </div>

            ) : content.length === 0 ? (

                <div className="admin-empty">

                    <h3>
                        لا يوجد محتوى
                    </h3>

                    <p>
                        يمكنك إنشاء محتوى من خلال API أو قاعدة البيانات.
                    </p>

                </div>

            ) : (

                <div className="content-editor-grid">

                    {content.map((item, index) => (

                        <div
                            className="content-editor-card"
                            key={item.id}
                        >

                            <div className="content-editor-header">

                                <div>

                                    <span>
                                        Section
                                    </span>

                                    <strong>
                                        {item.section}
                                    </strong>

                                </div>

                            </div>


                            <div className="admin-form">

                                <div className="form-group">

                                    <label>
                                        العنوان
                                    </label>

                                    <input
                                        value={
                                            item.title || ""
                                        }
                                        onChange={(event) =>
                                            updateItem(
                                                index,
                                                "title",
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        المحتوى
                                    </label>

                                    <textarea
                                        rows="6"
                                        value={
                                            item.content || ""
                                        }
                                        onChange={(event) =>
                                            updateItem(
                                                index,
                                                "content",
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>


                                <button
                                    className="btn btn-primary"
                                    onClick={() =>
                                        saveItem(item)
                                    }
                                >
                                    <Save size={17} />
                                    حفظ التعديلات
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default AdminContent;