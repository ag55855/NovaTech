import "dotenv/config";

import { PrismaClient } from "./generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter
});

const services = [
    {
        title: "تطوير المواقع الإلكترونية",
        description:
            "تصميم وتطوير مواقع ويب احترافية سريعة ومتجاوبة مع جميع الأجهزة."
    },
    {
        title: "تطوير تطبيقات الويب",
        description:
            "بناء تطبيقات ويب متقدمة وقابلة للتوسع باستخدام أحدث التقنيات."
    },
    {
        title: "الأنظمة ولوحات التحكم",
        description:
            "أنظمة إدارية ولوحات تحكم تساعدك على إدارة أعمالك وبياناتك بسهولة."
    },
    {
        title: "المتاجر الإلكترونية",
        description:
            "متاجر إلكترونية متكاملة لعرض المنتجات وإدارة الطلبات والعملاء."
    },
    {
        title: "UI/UX Design",
        description:
            "تصميم واجهات عصرية تركز على سهولة الاستخدام وتجربة المستخدم."
    },
    {
        title: "تحسين الأداء",
        description:
            "تحسين سرعة المواقع وتجربة المستخدم والأداء العام للتطبيقات."
    }
];

const projects = [
    {
        title: "متجر إلكتروني",
        description:
            "واجهة متجر إلكتروني عصرية لعرض المنتجات وإدارة تجربة الشراء.",
        image:
            "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=85"
    },
    {
        title: "لوحة تحكم إدارية",
        description:
            "Dashboard لإدارة البيانات والإحصائيات والمستخدمين والمشاريع.",
        image:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85"
    },
    {
        title: "نظام حجز مواعيد",
        description:
            "منصة حجز وتنظيم المواعيد مع واجهة سهلة للمستخدم والإدارة.",
        image:
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85"
    },
    {
        title: "موقع شركة",
        description:
            "موقع شركة احترافي يعرض الخدمات والأعمال وطرق التواصل.",
        image:
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85"
    },
    {
        title: "تطبيق خدمات",
        description:
            "تصميم واجهة تطبيق خدمات رقمية مع تجربة استخدام بسيطة.",
        image:
            "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=85"
    },
    {
        title: "منصة عقارية",
        description:
            "منصة لعرض العقارات والبحث عنها بطريقة منظمة وسهلة.",
        image:
            "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=85"
    }
];

const content = [
    {
        section: "hero",
        title: "نحوّل أفكارك إلى حلول رقمية حقيقية",
        content:
            "في NovaTech نقدم خدمات تطوير المواقع والتطبيقات والأنظمة الرقمية بجودة عالية وتصميم عصري يلبي احتياجاتك."
    },
    {
        section: "about",
        title: "نبني حلولًا رقمية تساعد أعمالك على النمو",
        content:
            "نعمل على تحويل الأفكار إلى منتجات رقمية عملية وسريعة وقابلة للتوسع، مع الاهتمام بتجربة المستخدم والأداء وجودة البرمجة."
    },
    {
        section: "contact",
        title: "لديك فكرة أو مشروع؟ دعنا نتحدث",
        content:
            "أرسل لنا تفاصيل مشروعك وسنتواصل معك لمناقشة أفضل الحلول المناسبة لك."
    }
];

async function main() {

    console.log("Starting NovaTech demo data...");

    for (const service of services) {

        const existing = await prisma.service.findFirst({
            where: {
                title: service.title
            }
        });

        if (!existing) {

            await prisma.service.create({
                data: service
            });

            console.log(
                `Added service: ${service.title}`
            );

        }

    }

    for (const project of projects) {

        const existing = await prisma.project.findFirst({
            where: {
                title: project.title
            }
        });

        if (!existing) {

            await prisma.project.create({
                data: project
            });

            console.log(
                `Added project: ${project.title}`
            );

        }

    }

    for (const item of content) {

        await prisma.siteContent.upsert({

            where: {
                section: item.section
            },

            update: {
                title: item.title,
                content: item.content
            },

            create: {
                section: item.section,
                title: item.title,
                content: item.content
            }

        });

        console.log(
            `Updated content: ${item.section}`
        );

    }

    console.log("");
    console.log("NovaTech demo data completed successfully.");

}

main()
    .catch((error) => {

        console.error(
            "Seed error:",
            error
        );

        process.exit(1);

    })
    .finally(async () => {

        await prisma.$disconnect();
        await pool.end();

    });