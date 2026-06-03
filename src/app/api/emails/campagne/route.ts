import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";

const EnvoiSchema = z.object({
  campagneId: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const url = new URL(req.url);
  if (url.pathname.endsWith("/envoyer")) {
    const body = await req.json();
    const parsed = EnvoiSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "campagneId requis" }, { status: 400 });

    const campagne = await prisma.emailCampagne.findUnique({
      where: { id: parsed.data.campagneId },
      include: { edition: { include: { participants: { include: { parent: true } } } } },
    });
    if (!campagne) return NextResponse.json({ error: "Campagne introuvable" }, { status: 404 });

    const destinataires = campagne.edition.participants
      .map((p) => p.parent.email)
      .filter((e): e is string => !!e);

    const uniqueDestinataires = Array.from(new Set(destinataires));
    let envoyes = 0;

    const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
    if (!resend) return NextResponse.json({ error: "Email non configuré" }, { status: 503 });

    for (const email of uniqueDestinataires) {
      try {
        await resend.emails.send({
          from: "LGVI <noreply@lgvi.bj>",
          to: email,
          subject: campagne.sujet,
          html: campagne.corps,
        });
        await prisma.emailLog.create({
          data: { campagneId: campagne.id, destinataire: email, statut: "envoye" },
        });
        envoyes++;
      } catch {
        await prisma.emailLog.create({
          data: { campagneId: campagne.id, destinataire: email, statut: "echec" },
        });
      }
    }

    await prisma.emailCampagne.update({
      where: { id: campagne.id },
      data: { statut: "ENVOYE", envoiAt: new Date() },
    });

    return NextResponse.json({ envoyes, total: uniqueDestinataires.length });
  }

  return NextResponse.json({ error: "Route introuvable" }, { status: 404 });
}
