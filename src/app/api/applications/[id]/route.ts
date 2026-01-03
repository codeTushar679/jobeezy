import { PrismaClient } from "@/generated/prisma/client";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
type Params = { params: Promise<{ id: string }> };

export async function DELETE(req: Request, { params }: Params) {
  const { userId } = await auth();
  const reparam = await params;
  const id = reparam?.id ?? new URL(req.url).pathname.split("/").pop();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const apply = await prisma.application.findUnique({
      where: { id },
    });

    if (!apply || apply.userId !== userId) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    await prisma.application.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Application deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete", error);
    return NextResponse.json(
      { error: "Failed to delete application" },
      { status: 500 }
    );
  }
}
