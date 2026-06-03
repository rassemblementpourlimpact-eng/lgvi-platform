import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";

const StatutSchema = z.object({
  statut: z.enum([
    "PREPARATION",
    "INSCRIPTIONS_OUVERTES",
    "EN_COURS",
    "TERMINEE",
    "ARCHIVEE",
  ]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = StatutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  const edition = await prisma.edition.update({
    where: { id },
    data: { statut: parsed.data.statut },
  });

  return NextResponse.json(edition);
}
