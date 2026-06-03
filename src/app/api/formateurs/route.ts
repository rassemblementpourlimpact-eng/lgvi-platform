import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";

const FormateurSchema = z.object({
  nom: z.string().min(1),
  prenom: z.string().min(1),
  telephone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  specialite: z.string().optional(),
  categorie: z.enum(["DIRECTION", "COORDINATION", "FORMATEUR", "ANIMATEUR", "MEDIA", "BENEVOLE"]).default("FORMATEUR"),
});

export async function GET() {
  const formateurs = await prisma.formateur.findMany({
    where: { actif: true },
    orderBy: [{ categorie: "asc" }, { nom: "asc" }],
    include: { _count: { select: { activites: true, groupes: true } } },
  });
  return NextResponse.json(formateurs);
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const parsed = FormateurSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const formateur = await prisma.formateur.create({ data: parsed.data });
  return NextResponse.json(formateur, { status: 201 });
}
