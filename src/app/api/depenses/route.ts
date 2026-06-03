import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";

const DepenseSchema = z.object({
  editionId: z.string().uuid(),
  categorie: z.enum(["FONCTIONNEMENT", "COMMUNICATION", "RESTAURATION", "MATERIEL", "LOGISTIQUE", "ACTIVITES", "AUTRE"]),
  description: z.string().min(1),
  montant: z.number().positive(),
  date: z.string(),
  justificatif: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const parsed = DepenseSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const depense = await prisma.depense.create({
    data: { ...parsed.data, date: new Date(parsed.data.date) },
  });
  return NextResponse.json(depense, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

  await prisma.depense.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
