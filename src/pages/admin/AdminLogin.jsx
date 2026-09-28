import { useState } from "react";
import { LockKeyhole, Mail, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function AdminLogin() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {

        event.preventDefault();

        setError("");
        setLoading(true);

        try {

            await login(
                email,
                password
            );

            navigate("/admin");

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "بيانات تسجيل الدخول غير صحيحة"
            );

        } finally {

            setLoading(false);

        }
    }

    return (
        <main className="admin-login-page">

            <div className="admin-login-container">

                <div className="admin-login-card">

                    <div className="admin-login-header">

                        <div className="admin-login-icon">
                            <LockKeyhole size={26} />
                        </div>

                        <span className="eyebrow">
                            لوحة التحكم
                        </span>

                        <h1>
                            تسجيل الدخول
                        </h1>

                        <p>
                            سجّل الدخول لإدارة محتوى الموقع
                            ومتابعة بيانات المشروع.
                        </p>

                    </div>


                    {error && (
                        <div className="admin-login-error">
                            {error}
                        </div>
                    )}


                    <form
                        onSubmit={handleSubmit}
                        className="admin-login-form"
                    >

                        <div className="form-group">

                            <label htmlFor="email">
                                البريد الإلكتروني
                            </label>

                            <div className="input-wrapper">

                                <Mail size={19} />

                                <input
                                    id="email"
                                    type="email"
                                    placeholder="admin@example.com"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(
                                            event.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                        </div>


                        <div className="form-group">

                            <label htmlFor="password">
                                كلمة المرور
                            </label>

                            <div className="input-wrapper">

                                <LockKeyhole size={19} />

                                <input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(
                                            event.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                        </div>


                        <button
                            type="submit"
                            className="btn btn-primary admin-login-submit"
                            disabled={loading}
                        >

                            {loading ? (
                                "جاري تسجيل الدخول..."
                            ) : (
                                <>
                                    تسجيل الدخول
                                    <LogIn size={19} />
                                </>
                            )}

                        </button>

                    </form>

                </div>

            </div>

        </main>
    );
}

export default AdminLogin;