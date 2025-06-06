// api/test.ts
"use server";
import { NextResponse, NextRequest } from "next/server";

import prisma from "@/app/lib/prisma";
import { auth } from "@/app/auth";

export async function GET(request: NextRequest) {
  let boards: any = [];
  const session = await auth();

  if (session?.user && session.user.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (user) {
      boards = await prisma.board.findMany({
        include: { shared_access: true },
        where: {
          owner: {
            id: user?.id,
          },
        },
      });
    }
  }

  return NextResponse.json(boards, { status: 200 });
}
