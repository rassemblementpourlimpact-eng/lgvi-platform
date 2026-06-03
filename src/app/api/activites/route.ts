import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";

const ActiviteSchema = z.object({
  nom: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(["PRINCIPALE", "COMPLEMENTAIRE"]).default("PRINCIPALE"),
  capacite: z.number().int().min(1),
  salle: z.string().optional(),
  horaires: z.string().optional(),
  editionId: z.string().uuid(),
  formateurId: z.string().uuid().optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const parsed = ActiviteSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const activite = await prisma.activite.create({ data: parsed.data });
  return NextResponse.json(activite, { status: 201 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const editionId = searchParams.get("editionId");

  const activites = await prisma.activite.findMany({
    where: editionId ? { editionId } : {},
    include: {
      formateur: { select: { prenom: true, nom: true } },
      _count: { select: { participants: true } },
    },
    orderBy: { nom: "asc" },
  });

  return NextResponse.json(activites);
}
