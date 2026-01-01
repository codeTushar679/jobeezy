import { PrismaClient } from "@/generated/prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const newJob = await prisma.job.create({
      data: {
        title: data.title,
        company: data.company,
        location: data.location,
        type: data.type,
        description: data.description,
        salary: data.salary,
        postedAt: new Date(),
      },
    });
    console.log("Job created successfully");
    return NextResponse.json(
      { data: newJob, success: true, message: "Job created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating job", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const jobs = await prisma.job.findMany();
    return NextResponse.json(jobs, { status: 200 });
    console.log("Found jobs");
  } catch (error) {
    console.error("Error fetching jobs", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
