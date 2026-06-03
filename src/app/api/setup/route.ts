import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Endpoint de premier démarrage — crée le super admin si aucun utilisateur n'existe
export async function POST(req: NextRequest) {
  const count = await prisma.user.count();
  if (count > 0) {
    return NextResponse.json({ error: "Setup déjà effectué." }, { status: 403 });
  }

  const { email, password, name } = await req.json();
  if (!email || !password || !name) {
    return NextResponse.json({ error: "email, password et name requis" }, { status: 400 });
  }

  const result = await auth.api.signUpEmail({
    body: { email, password, name },
  });

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  await prisma.user.updateMany({
    where: { email },
    data: { role: "SUPER_ADMIN" },
  });

  return NextResponse.json({ ok: true, message: `Compte super admin créé pour ${email}` });
}
