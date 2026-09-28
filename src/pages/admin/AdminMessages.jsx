import { useEffect, useState } from "react";

import {
    Mail,
    Trash2,
    CheckCircle
} from "lucide-react";

import api from "../../services/api";

function AdminMessages() {

    const [messages, setMessages] = useState([]);

    async function loadMessages() {

        try {

            const response =
                await api.get("/messages");

            setMessages(response.data);

        } catch (error) {

            console.error(error);

        }
    }

    useEffect(() => {

        loadMessages();

    }, []);

    async function markAsRead(id) {

        try {

            await api.patch(
                `/messages/${id}/read`
            );

            await loadMessages();

        } catch (error) {

            console.error(error);

        }
    }

    async function deleteMessage(id) {

        if (
            !window.confirm(
                "هل تريد حذف هذه الرسالة؟"
            )
        ) {
            return;
        }

        try {

            await api.delete(
                `/messages/${id}`
            );

            await loadMessages();

        } catch (error) {

            console.error(error);

        }
    }

    return (
        <div className="admin-page">

            <div className="admin-page-header">

                <div>

                    <span className="eyebrow">
                        Messages
                    </span>

                    <h1>
                        الرسائل
                    </h1>

                    <p>
                        الرسائل المرسلة من نموذج التواصل.
                    </p>

                </div>

            </div>


            <div className="messages-grid">

                {messages.length === 0 ? (

                    <div className="admin-empty">

                        <Mail size={35} />

                        <h3>
                            لا توجد رسائل
                        </h3>

                    </div>

                ) : (

                    messages.map((message) => (

                        <article
                            className={
                                message.isRead
                                    ? "message-card read"
                                    : "message-card"
                            }
                            key={message.id}
                        >

                            <div className="message-header">

                                <div>

                                    <h3>
                                        {message.name}
                                    </h3>

                                    <span>
                                        {message.email}
                                    </span>

                                </div>


                                {!message.isRead && (
                                    <span className="unread-badge">
                                        جديدة
                                    </span>
                                )}

                            </div>


                            {message.phone && (
                                <p className="message-phone">
                                    {message.phone}
                                </p>
                            )}


                            <p className="message-body">
                                {message.message}
                            </p>


                            <div className="message-actions">

                                {!message.isRead && (

                                    <button
                                        onClick={() =>
                                            markAsRead(
                                                message.id
                                            )
                                        }
                                    >
                                        <CheckCircle size={16} />
                                        تحديد كمقروءة
                                    </button>

                                )}


                                <button
                                    className="message-delete"
                                    onClick={() =>
                                        deleteMessage(
                                            message.id
                                        )
                                    }
                                >
                                    <Trash2 size={16} />
                                    حذف
                                </button>

                            </div>

                        </article>

                    ))

                )}

            </div>

        </div>
    );
}

export default AdminMessages;