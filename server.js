import express from "express";
import cors from "cors";
import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

import { PrismaClient } from "./generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";


// ==================================================
// Prisma
// ==================================================

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({
    adapter
});


// ==================================================
// App
// ==================================================

const app = express();

const PORT = process.env.PORT || 5000;


// ==================================================
// Middleware
// ==================================================

app.use(cors());

app.use(express.json());


// ==================================================
// Helpers
// ==================================================

function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(
            fn(req, res, next)
        ).catch(next);
    };
}


function createToken(admin) {

    return jwt.sign(
        {
            id: admin.id,
            role: "ADMIN"
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );
}


function publicAdmin(admin) {

    return {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        createdAt: admin.createdAt
    };
}


// ==================================================
// Authentication Middleware
// ==================================================

function authMiddleware(req, res, next) {

    const authHeader =
        req.headers.authorization;

    if (!authHeader) {

        return res.status(401).json({
            message:
                "Access denied. No token provided."
        });

    }

    const parts =
        authHeader.split(" ");

    if (
        parts.length !== 2 ||
        parts[0] !== "Bearer"
    ) {

        return res.status(401).json({
            message:
                "Invalid authorization format"
        });

    }

    try {

        const decoded =
            jwt.verify(
                parts[1],
                process.env.JWT_SECRET
            );

        if (
            decoded.role !== "ADMIN"
        ) {

            return res.status(403).json({
                message:
                    "Admin access required"
            });

        }

        req.admin = decoded;

        next();

    } catch {

        return res.status(401).json({
            message:
                "Invalid or expired token"
        });

    }
}


// ==================================================
// Email
// ==================================================

let transporter = null;

if (
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASSWORD
) {

    transporter =
        nodemailer.createTransport({
            host:
                process.env.SMTP_HOST,

            port:
                Number(
                    process.env.SMTP_PORT || 587
                ),

            secure:
                process.env.SMTP_SECURE === "true",

            auth: {
                user:
                    process.env.SMTP_USER,

                pass:
                    process.env.SMTP_PASSWORD
            }
        });

}


async function sendContactEmail(message) {

    if (!transporter) {

        console.log(
            "SMTP is not configured. Email was not sent."
        );

        return;

    }

    await transporter.sendMail({

        from:
            process.env.SMTP_FROM ||
            process.env.SMTP_USER,

        to:
            process.env.CONTACT_EMAIL ||
            process.env.SMTP_USER,

        replyTo:
            message.email,

        subject:
            `New Contact Message - ${message.name}`,

        text:
`New message from company website.

Name: ${message.name}

Email: ${message.email}

Phone: ${message.phone || "Not provided"}

Message:

${message.message}
`
    });

}


// ==================================================
// Home
// ==================================================

app.get("/", (req, res) => {

    res.json({
        message:
            "Company Website API is running"
    });

});


// ==================================================
// Health
// ==================================================

app.get("/api/health", (req, res) => {

    res.json({
        status: "ok"
    });

});


// ==================================================
// Authentication
// ==================================================


// --------------------------------------------------
// Admin Login
// --------------------------------------------------

app.post(
    "/api/auth/login",
    asyncHandler(async (req, res) => {

        const {
            email,
            password
        } = req.body;

        if (!email || !password) {

            return res.status(400).json({
                message:
                    "Email and password are required"
            });

        }

        const admin =
            await prisma.admin.findUnique({
                where: {
                    email:
                        email
                            .trim()
                            .toLowerCase()
                }
            });

        if (!admin) {

            return res.status(401).json({
                message:
                    "Invalid email or password"
            });

        }

        const passwordCorrect =
            await bcrypt.compare(
                password,
                admin.password
            );

        if (!passwordCorrect) {

            return res.status(401).json({
                message:
                    "Invalid email or password"
            });

        }

        const token =
            createToken(admin);

        res.json({

            message:
                "Login successful",

            token,

            admin:
                publicAdmin(admin)

        });

    })
);


// --------------------------------------------------
// Current Admin
// --------------------------------------------------

app.get(
    "/api/auth/me",
    authMiddleware,
    asyncHandler(async (req, res) => {

        const admin =
            await prisma.admin.findUnique({
                where: {
                    id: req.admin.id
                }
            });

        if (!admin) {

            return res.status(404).json({
                message:
                    "Admin not found"
            });

        }

        res.json(
            publicAdmin(admin)
        );

    })
);


// ==================================================
// Dashboard
// ==================================================

app.get(
    "/api/dashboard",
    authMiddleware,
    asyncHandler(async (req, res) => {

        const [
            services,
            projects,
            messages,
            unreadMessages
        ] = await Promise.all([

            prisma.service.count(),

            prisma.project.count(),

            prisma.message.count(),

            prisma.message.count({
                where: {
                    isRead: false
                }
            })

        ]);

        res.json({

            services,

            projects,

            messages,

            unreadMessages

        });

    })
);


// ==================================================
// Services
// ==================================================


// --------------------------------------------------
// Get Services - Public
// --------------------------------------------------

app.get(
    "/api/services",
    asyncHandler(async (req, res) => {

        const services =
            await prisma.service.findMany({

                orderBy: {
                    createdAt:
                        "desc"
                }

            });

        res.json(services);

    })
);


// --------------------------------------------------
// Get Service
// --------------------------------------------------

app.get(
    "/api/services/:id",
    asyncHandler(async (req, res) => {

        const id =
            Number(req.params.id);

        if (!Number.isInteger(id)) {

            return res.status(400).json({
                message:
                    "Invalid service id"
            });

        }

        const service =
            await prisma.service.findUnique({
                where: {
                    id
                }
            });

        if (!service) {

            return res.status(404).json({
                message:
                    "Service not found"
            });

        }

        res.json(service);

    })
);


// --------------------------------------------------
// Create Service - Admin
// --------------------------------------------------

app.post(
    "/api/services",
    authMiddleware,
    asyncHandler(async (req, res) => {

        const {
            title,
            description
        } = req.body;

        if (!title) {

            return res.status(400).json({
                message:
                    "Title is required"
            });

        }

        const service =
            await prisma.service.create({

                data: {

                    title:
                        title.trim(),

                    description:
                        description
                            ? description.trim()
                            : null

                }

            });

        res.status(201).json(service);

    })
);


// --------------------------------------------------
// Update Service - Admin
// --------------------------------------------------

app.put(
    "/api/services/:id",
    authMiddleware,
    asyncHandler(async (req, res) => {

        const id =
            Number(req.params.id);

        if (!Number.isInteger(id)) {

            return res.status(400).json({
                message:
                    "Invalid service id"
            });

        }

        const existing =
            await prisma.service.findUnique({
                where: {
                    id
                }
            });

        if (!existing) {

            return res.status(404).json({
                message:
                    "Service not found"
            });

        }

        const {
            title,
            description
        } = req.body;

        if (
            title !== undefined &&
            !title.trim()
        ) {

            return res.status(400).json({
                message:
                    "Title cannot be empty"
            });

        }

        const service =
            await prisma.service.update({

                where: {
                    id
                },

                data: {

                    ...(title !== undefined && {
                        title:
                            title.trim()
                    }),

                    ...(description !== undefined && {
                        description:
                            description
                                ? description.trim()
                                : null
                    })

                }

            });

        res.json(service);

    })
);


// --------------------------------------------------
// Delete Service - Admin
// --------------------------------------------------

app.delete(
    "/api/services/:id",
    authMiddleware,
    asyncHandler(async (req, res) => {

        const id =
            Number(req.params.id);

        if (!Number.isInteger(id)) {

            return res.status(400).json({
                message:
                    "Invalid service id"
            });

        }

        const service =
            await prisma.service.findUnique({
                where: {
                    id
                }
            });

        if (!service) {

            return res.status(404).json({
                message:
                    "Service not found"
            });

        }

        await prisma.service.delete({
            where: {
                id
            }
        });

        res.json({
            message:
                "Service deleted successfully"
        });

    })
);


// ==================================================
// Projects
// ==================================================


// --------------------------------------------------
// Get Projects - Public
// --------------------------------------------------

app.get(
    "/api/projects",
    asyncHandler(async (req, res) => {

        const projects =
            await prisma.project.findMany({

                orderBy: {
                    createdAt:
                        "desc"
                }

            });

        res.json(projects);

    })
);


// --------------------------------------------------
// Get Project
// --------------------------------------------------

app.get(
    "/api/projects/:id",
    asyncHandler(async (req, res) => {

        const id =
            Number(req.params.id);

        if (!Number.isInteger(id)) {

            return res.status(400).json({
                message:
                    "Invalid project id"
            });

        }

        const project =
            await prisma.project.findUnique({
                where: {
                    id
                }
            });

        if (!project) {

            return res.status(404).json({
                message:
                    "Project not found"
            });

        }

        res.json(project);

    })
);


// --------------------------------------------------
// Create Project - Admin
// --------------------------------------------------

app.post(
    "/api/projects",
    authMiddleware,
    asyncHandler(async (req, res) => {

        const {
            title,
            description,
            image,
            link
        } = req.body;

        if (!title) {

            return res.status(400).json({
                message:
                    "Title is required"
            });

        }

        const project =
            await prisma.project.create({

                data: {

                    title:
                        title.trim(),

                    description:
                        description
                            ? description.trim()
                            : null,

                    image:
                        image
                            ? image.trim()
                            : null,

                    link:
                        link
                            ? link.trim()
                            : null

                }

            });

        res.status(201).json(project);

    })
);


// --------------------------------------------------
// Update Project - Admin
// --------------------------------------------------

app.put(
    "/api/projects/:id",
    authMiddleware,
    asyncHandler(async (req, res) => {

        const id =
            Number(req.params.id);

        if (!Number.isInteger(id)) {

            return res.status(400).json({
                message:
                    "Invalid project id"
            });

        }

        const existing =
            await prisma.project.findUnique({
                where: {
                    id
                }
            });

        if (!existing) {

            return res.status(404).json({
                message:
                    "Project not found"
            });

        }

        const {
            title,
            description,
            image,
            link
        } = req.body;

        if (
            title !== undefined &&
            !title.trim()
        ) {

            return res.status(400).json({
                message:
                    "Title cannot be empty"
            });

        }

        const project =
            await prisma.project.update({

                where: {
                    id
                },

                data: {

                    ...(title !== undefined && {
                        title:
                            title.trim()
                    }),

                    ...(description !== undefined && {
                        description:
                            description
                                ? description.trim()
                                : null
                    }),

                    ...(image !== undefined && {
                        image:
                            image
                                ? image.trim()
                                : null
                    }),

                    ...(link !== undefined && {
                        link:
                            link
                                ? link.trim()
                                : null
                    })

                }

            });

        res.json(project);

    })
);


// --------------------------------------------------
// Delete Project - Admin
// --------------------------------------------------

app.delete(
    "/api/projects/:id",
    authMiddleware,
    asyncHandler(async (req, res) => {

        const id =
            Number(req.params.id);

        if (!Number.isInteger(id)) {

            return res.status(400).json({
                message:
                    "Invalid project id"
            });

        }

        const project =
            await prisma.project.findUnique({
                where: {
                    id
                }
            });

        if (!project) {

            return res.status(404).json({
                message:
                    "Project not found"
            });

        }

        await prisma.project.delete({
            where: {
                id
            }
        });

        res.json({
            message:
                "Project deleted successfully"
        });

    })
);


// ==================================================
// Site Content
// ==================================================


// --------------------------------------------------
// Get All Content - Public
// --------------------------------------------------

app.get(
    "/api/content",
    asyncHandler(async (req, res) => {

        const content =
            await prisma.siteContent.findMany({

                orderBy: {
                    id: "asc"
                }

            });

        res.json(content);

    })
);


// --------------------------------------------------
// Get Content Section
// --------------------------------------------------

app.get(
    "/api/content/:section",
    asyncHandler(async (req, res) => {

        const content =
            await prisma.siteContent.findUnique({

                where: {
                    section:
                        req.params.section
                }

            });

        if (!content) {

            return res.status(404).json({
                message:
                    "Content section not found"
            });

        }

        res.json(content);

    })
);


// --------------------------------------------------
// Create Content - Admin
// --------------------------------------------------

app.post(
    "/api/content",
    authMiddleware,
    asyncHandler(async (req, res) => {

        const {
            section,
            title,
            content
        } = req.body;

        if (!section) {

            return res.status(400).json({
                message:
                    "Section is required"
            });

        }

        const existing =
            await prisma.siteContent.findUnique({

                where: {
                    section:
                        section.trim()
                }

            });

        if (existing) {

            return res.status(409).json({
                message:
                    "This section already exists"
            });

        }

        const siteContent =
            await prisma.siteContent.create({

                data: {

                    section:
                        section.trim(),

                    title:
                        title
                            ? title.trim()
                            : null,

                    content:
                        content
                            ? content.trim()
                            : null

                }

            });

        res.status(201).json(
            siteContent
        );

    })
);


// --------------------------------------------------
// Update Content - Admin
// --------------------------------------------------

app.put(
    "/api/content/:section",
    authMiddleware,
    asyncHandler(async (req, res) => {

        const section =
            req.params.section;

        const existing =
            await prisma.siteContent.findUnique({

                where: {
                    section
                }

            });

        if (!existing) {

            return res.status(404).json({
                message:
                    "Content section not found"
            });

        }

        const {
            title,
            content
        } = req.body;

        const updated =
            await prisma.siteContent.update({

                where: {
                    section
                },

                data: {

                    ...(title !== undefined && {
                        title:
                            title
                                ? title.trim()
                                : null
                    }),

                    ...(content !== undefined && {
                        content:
                            content
                                ? content.trim()
                                : null
                    })

                }

            });

        res.json(updated);

    })
);


// --------------------------------------------------
// Delete Content - Admin
// --------------------------------------------------

app.delete(
    "/api/content/:section",
    authMiddleware,
    asyncHandler(async (req, res) => {

        const section =
            req.params.section;

        const existing =
            await prisma.siteContent.findUnique({

                where: {
                    section
                }

            });

        if (!existing) {

            return res.status(404).json({
                message:
                    "Content section not found"
            });

        }

        await prisma.siteContent.delete({

            where: {
                section
            }

        });

        res.json({
            message:
                "Content deleted successfully"
        });

    })
);


// ==================================================
// Contact Messages
// ==================================================


// --------------------------------------------------
// Send Message - Public
// --------------------------------------------------

app.post(
    "/api/messages",
    asyncHandler(async (req, res) => {

        const {
            name,
            email,
            phone,
            message
        } = req.body;

        if (
            !name ||
            !email ||
            !message
        ) {

            return res.status(400).json({
                message:
                    "Name, email and message are required"
            });

        }

        const savedMessage =
            await prisma.message.create({

                data: {

                    name:
                        name.trim(),

                    email:
                        email.trim().toLowerCase(),

                    phone:
                        phone
                            ? phone.trim()
                            : null,

                    message:
                        message.trim()

                }

            });

        try {

            await sendContactEmail(
                savedMessage
            );

        } catch (error) {

            console.error(
                "Email sending failed:",
                error.message
            );

        }

        res.status(201).json({

            message:
                "Your message has been sent successfully",

            data: {
                id:
                    savedMessage.id
            }

        });

    })
);


// --------------------------------------------------
// Get Messages - Admin
// --------------------------------------------------

app.get(
    "/api/messages",
    authMiddleware,
    asyncHandler(async (req, res) => {

        const messages =
            await prisma.message.findMany({

                orderBy: {
                    createdAt:
                        "desc"
                }

            });

        res.json(messages);

    })
);


// --------------------------------------------------
// Get Message - Admin
// --------------------------------------------------

app.get(
    "/api/messages/:id",
    authMiddleware,
    asyncHandler(async (req, res) => {

        const id =
            Number(req.params.id);

        if (!Number.isInteger(id)) {

            return res.status(400).json({
                message:
                    "Invalid message id"
            });

        }

        const message =
            await prisma.message.findUnique({

                where: {
                    id
                }

            });

        if (!message) {

            return res.status(404).json({
                message:
                    "Message not found"
            });

        }

        res.json(message);

    })
);


// --------------------------------------------------
// Mark Message As Read - Admin
// --------------------------------------------------

app.patch(
    "/api/messages/:id/read",
    authMiddleware,
    asyncHandler(async (req, res) => {

        const id =
            Number(req.params.id);

        if (!Number.isInteger(id)) {

            return res.status(400).json({
                message:
                    "Invalid message id"
            });

        }

        const message =
            await prisma.message.findUnique({

                where: {
                    id
                }

            });

        if (!message) {

            return res.status(404).json({
                message:
                    "Message not found"
            });

        }

        const updated =
            await prisma.message.update({

                where: {
                    id
                },

                data: {
                    isRead: true
                }

            });

        res.json(updated);

    })
);


// --------------------------------------------------
// Delete Message - Admin
// --------------------------------------------------

app.delete(
    "/api/messages/:id",
    authMiddleware,
    asyncHandler(async (req, res) => {

        const id =
            Number(req.params.id);

        if (!Number.isInteger(id)) {

            return res.status(400).json({
                message:
                    "Invalid message id"
            });

        }

        const message =
            await prisma.message.findUnique({

                where: {
                    id
                }

            });

        if (!message) {

            return res.status(404).json({
                message:
                    "Message not found"
            });

        }

        await prisma.message.delete({

            where: {
                id
            }

        });

        res.json({
            message:
                "Message deleted successfully"
        });

    })
);


// ==================================================
// 404
// ==================================================

app.use((req, res) => {

    res.status(404).json({
        message:
            "Route not found"
    });

});


// ==================================================
// Global Error Handler
// ==================================================

app.use((error, req, res, next) => {

    console.error(error);

    if (res.headersSent) {
        return next(error);
    }

    res.status(500).json({
        message:
            "Internal server error"
    });

});


// ==================================================
// Start Server
// ==================================================

app.listen(
    PORT,
    () => {

        console.log(
            `Server running on http://localhost:${PORT}`
        );

    }
);