import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";

const EditionSchema = z.object({
  nom: z.string().min(1),
  annee: z.number().int().min(2020),
  dateOuverture: z.string().datetime(),
  dateFermeture: z.string().datetime(),
  dateDebut: z.string().datetime(),
  dateFin: z.string().datetime(),
  capaciteMaximale: z.number().int().min(1),
  description: z.string().optional(),
});

export async function GET() {
  const editions = await prisma.edition.findMany({
    orderBy: { annee: "desc" },
    include: {
      _count: { select: { participants: true } },
    },
  });
  return NextResponse.json(editions);
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const parsed = EditionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const d = parsed.data;
  const edition = await prisma.edition.create({
    data: {
      nom: d.nom,
      annee: d.annee,
      dateOuverture: new Date(d.dateOuverture),
      dateFermeture: new Date(d.dateFermeture),
      dateDebut: new Date(d.dateDebut),
      dateFin: new Date(d.dateFin),
      capaciteMaximale: d.capaciteMaximale,
      description: d.description,
    },
  });

  return NextResponse.json(edition, { status: 201 });
}
