import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";

const AlbumSchema = z.object({
  editionId: z.string().uuid(),
  titre: z.string().min(1),
  activite: z.string().optional(),
  date: z.string().optional(),
});

const MediaSchema = z.object({
  albumId: z.string().uuid(),
  cloudinaryId: z.string().min(1),
  url: z.string().url(),
  type: z.enum(["PHOTO", "VIDEO"]).default("PHOTO"),
  alt: z.string().optional(),
  ordre: z.number().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const editionId = searchParams.get("editionId");

  const albums = await prisma.mediaAlbum.findMany({
    where: editionId ? { editionId } : {},
    include: { medias: { orderBy: { ordre: "asc" }, take: 4 }, _count: { select: { medias: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(albums);
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();

  if (body.albumId) {
    const parsed = MediaSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const media = await prisma.media.create({ data: parsed.data });
    return NextResponse.json(media, { status: 201 });
  }

  const parsed = AlbumSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const album = await prisma.mediaAlbum.create({
    data: { ...parsed.data, date: parsed.data.date ? new Date(parsed.data.date) : undefined },
  });
  return NextResponse.json(album, { status: 201 });
}
