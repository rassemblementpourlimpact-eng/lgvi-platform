import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";

const CampagneSchema = z.object({
  editionId: z.string().uuid(),
  sujet: z.string().min(1),
  corps: z.string().min(1),
  cible: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const editionId = searchParams.get("editionId");
  const campagnes = await prisma.emailCampagne.findMany({
    where: editionId ? { editionId } : {},
    include: { _count: { select: { logs: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(campagnes);
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const parsed = CampagneSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const campagne = await prisma.emailCampagne.create({ data: parsed.data });
  return NextResponse.json(campagne, { status: 201 });
}
