import { useState } from "react";
import {
    Mail,
    Phone,
    MessageCircle,
    Send
} from "lucide-react";

import api from "../services/api";
import siteConfig from "../config/site";
function Contact() {

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    function handleChange(event) {

        setForm({
            ...form,
            [event.target.name]: event.target.value
        });

    }

    async function handleSubmit(event) {

        event.preventDefault();

        setLoading(true);
        setSuccess("");
        setError("");

        try {

            await api.post(
                "/messages",
                form
            );

            setSuccess(
                "تم إرسال رسالتك بنجاح، وسنتواصل معك قريبًا."
            );

            setForm({
                name: "",
                email: "",
                phone: "",
                message: ""
            });

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "حدث خطأ أثناء إرسال الرسالة."
            );

        } finally {

            setLoading(false);

        }
    }

    return (
        <main>

            <section className="page-hero">

                <div className="container">

                    <span className="eyebrow">
                        تواصل معنا
                    </span>

                    <h1>
                        لديك فكرة أو مشروع؟
                        <br />
                        دعنا نتحدث
                    </h1>

                    <p>
                        أرسل لنا تفاصيل مشروعك وسنتواصل معك
                        لمناقشة أفضل الحلول المناسبة لك.
                    </p>

                </div>

            </section>


            <section className="section">

                <div className="container contact-layout">

                    <div className="contact-info">

                        <span className="eyebrow">
                            معلومات التواصل
                        </span>

                        <h2>
                            نحن جاهزون لسماع فكرتك
                        </h2>

                        <p>
                            يمكنك التواصل معنا مباشرة أو
                            إرسال رسالة من النموذج.
                        </p>


                       <a
    href={`mailto:${siteConfig.email}`}
    className="contact-item"
>
    <Mail size={20} />
    {siteConfig.email}
</a>

<a
    href={`tel:${siteConfig.phone}`}
    className="contact-item"
>
    <Phone size={20} />
    {siteConfig.phone}
</a>

<a
    href={`https://wa.me/${siteConfig.whatsapp}`}
    target="_blank"
    rel="noreferrer"
    className="contact-item"
>
    <MessageCircle size={20} />
    تواصل عبر واتساب
</a>
                    </div>


                    <form
                        className="contact-form"
                        onSubmit={handleSubmit}
                    >

                        {success && (
                            <div className="form-success">
                                {success}
                            </div>
                        )}

                        {error && (
                            <div className="form-error">
                                {error}
                            </div>
                        )}


                        <div className="form-row">

                            <div className="form-group">

                                <label>
                                    الاسم
                                </label>

                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="اكتب اسمك"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    البريد الإلكتروني
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="example@email.com"
                                />

                            </div>

                        </div>


                        <div className="form-group">

                            <label>
                                رقم الهاتف
                            </label>

                            <input
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="+20 ..."
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                الرسالة
                            </label>

                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                required
                                rows="6"
                                placeholder="اكتب تفاصيل مشروعك..."
                            />

                        </div>


                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >

                            {loading
                                ? "جاري الإرسال..."
                                : "إرسال الرسالة"
                            }

                            <Send size={18} />

                        </button>

                    </form>

                </div>

            </section>

        </main>
    );
}

export default Contact;