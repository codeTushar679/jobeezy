import { PrismaClient } from "@/generated/prisma/client";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const {userId} = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const {jobId} = await req.json();

        if (!jobId) {
            return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
        }

        // Check if the application already exists
        const exist = await prisma.application.findUnique({
            where: {
                jobId_userId: { jobId, userId}
            }
        })

        if(exist){
            return NextResponse.json({ message: "Already applied for this job" }, { status: 400 });
        }

        const apply = await prisma.application.create({
            data: {jobId, userId, appliedAt: new Date()},
            include: { job: true }
        })
        return NextResponse.json(apply, { status: 201})

    } catch (error) {
        console.error("Apply error", error);
        return NextResponse.json({ error: "Failed to apply for job" }, { status: 500 });
    }
}

export async function GET() {
    const {userId} = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const applies = await prisma.application.findMany({
            where: { userId },
            include: { job: true },
            orderBy: { appliedAt: "desc" }
        });
        return NextResponse.json(applies, { status: 200});
    } catch (error) {
        console.error("Fetch apply error", error);
        return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
    }
}