import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";

const RoleSchema = z.object({
  userId: z.string(),
  role: z.enum(["SUPER_ADMIN", "DIRECTION", "COMPTABILITE", "COMMUNICATION", "ACCUEIL", "FORMATEUR", "COORDINATEUR", "LECTURE_SEULE"]),
});

const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["SUPER_ADMIN", "DIRECTION", "COMPTABILITE", "COMMUNICATION", "ACCUEIL", "FORMATEUR", "COORDINATEUR", "LECTURE_SEULE"]).default("LECTURE_SEULE"),
});

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true, emailVerified: true },
  });
  return NextResponse.json(users);
}

export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const parsed = RoleSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const user = await prisma.user.update({
    where: { id: parsed.data.userId },
    data: { role: parsed.data.role },
    select: { id: true, name: true, email: true, role: true },
  });
  return NextResponse.json(user);
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const parsed = CreateUserSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const result = await auth.api.signUpEmail({
    body: { name: parsed.data.name, email: parsed.data.email, password: parsed.data.password },
  });

  if (!result || !("user" in result)) {
    return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 });
  }

  await prisma.user.update({
    where: { id: result.user.id },
    data: { role: parsed.data.role },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
