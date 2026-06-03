import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";

const PresenceSchema = z.object({
  participantId: z.string().uuid(),
  editionId: z.string().uuid(),
  date: z.string(),
  statut: z.enum(["PRESENT", "ABSENT", "RETARD", "DEPART_ANTICIPE"]),
  groupeId: z.string().uuid().optional(),
  note: z.string().optional(),
});

const PresencesBulkSchema = z.object({
  presences: z.array(PresenceSchema),
});

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();

  // Support bulk ou single
  if (Array.isArray(body.presences)) {
    const parsed = PresencesBulkSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const result = await prisma.$transaction(
      parsed.data.presences.map((p) =>
        prisma.presence.upsert({
          where: { participantId_date: { participantId: p.participantId, date: new Date(p.date) } },
          update: { statut: p.statut, note: p.note },
          create: {
            participantId: p.participantId,
            editionId: p.editionId,
            groupeId: p.groupeId,
            date: new Date(p.date),
            statut: p.statut,
            note: p.note,
          },
        })
      )
    );
    return NextResponse.json({ count: result.length });
  }

  const parsed = PresenceSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const p = parsed.data;
  const presence = await prisma.presence.upsert({
    where: { participantId_date: { participantId: p.participantId, date: new Date(p.date) } },
    update: { statut: p.statut, note: p.note },
    create: {
      participantId: p.participantId,
      editionId: p.editionId,
      groupeId: p.groupeId,
      date: new Date(p.date),
      statut: p.statut,
    },
  });

  return NextResponse.json(presence);
}
