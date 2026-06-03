import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getAgeAtEditionStart } from "@/lib/age";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const editionId = searchParams.get("editionId");
  if (!editionId) return NextResponse.json({ error: "editionId requis" }, { status: 400 });

  const [edition, participants] = await Promise.all([
    prisma.edition.findUnique({ where: { id: editionId } }),
    prisma.participant.findMany({
      where: { editionId, statut: "ACTIF" },
      include: {
        activites: { include: { activite: { select: { nom: true } } }, take: 1 },
      },
      orderBy: [{ nom: "asc" }, { prenom: "asc" }],
    }),
  ]);

  if (!edition) return NextResponse.json({ error: "Édition introuvable" }, { status: 404 });

  const JOURS = ["Lun", "Mar", "Jeu", "Ven"];

  const lignes = participants.map((p, i) => {
    const age = getAgeAtEditionStart(p.dateNaissance, edition.dateDebut);
    const activite = p.activites[0]?.activite?.nom ?? "—";
    const cases = JOURS.map(() => `<td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;border-right:1px solid #e2e8f0;min-width:50px">&nbsp;</td>`).join("");
    return `
      <tr style="background:${i % 2 === 0 ? "#ffffff" : "#f8fafc"}">
        <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;border-right:1px solid #e2e8f0">${i + 1}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;border-right:1px solid #e2e8f0;font-weight:600">${p.prenom} ${p.nom}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;border-right:1px solid #e2e8f0">${age} ans</td>
        <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;border-right:1px solid #e2e8f0">${activite}</td>
        ${cases}
        <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0">&nbsp;</td>
      </tr>`;
  }).join("");

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Feuille de présence — ${edition.nom}</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 11px; color: #1e293b; margin: 20px; }
    h1 { font-size: 16px; color: #1e3a5f; margin-bottom: 4px; }
    p.sub { color: #64748b; margin: 0 0 8px; font-size: 10px; }
    .semaine { display: inline-block; margin-bottom: 16px; font-size: 11px; font-weight: 600; color: #64748b; }
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: #1e3a5f; color: white; }
    th { padding: 8px 10px; text-align: center; font-size: 10px; text-transform: uppercase; letter-spacing: .5px; }
    th:first-child, th:nth-child(2), th:nth-child(3), th:nth-child(4) { text-align: left; }
    .footer { margin-top: 20px; color: #94a3b8; font-size: 10px; text-align: right; }
    .sig { margin-top: 40px; display: flex; gap: 80px; }
    .sig div { border-top: 1px solid #cbd5e1; padding-top: 4px; font-size: 10px; color: #64748b; min-width: 150px; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <h1>Feuille de présence — ${edition.nom}</h1>
  <p class="sub">Semaine du _____ / _____ / _____ · ${participants.length} participant${participants.length > 1 ? "s" : ""}</p>
  <table>
    <thead>
      <tr>
        <th style="text-align:left">#</th>
        <th style="text-align:left">Nom / Prénom</th>
        <th style="text-align:left">Âge</th>
        <th style="text-align:left">Activité</th>
        ${JOURS.map((j) => `<th>${j}</th>`).join("")}
        <th>Note</th>
      </tr>
    </thead>
    <tbody>${lignes}</tbody>
  </table>
  <div class="sig">
    <div>Signature formateur</div>
    <div>Signature coordinateur</div>
  </div>
  <div class="footer">LGVI — Les Grandes Vacances de l'Impact · Cotonou, Bénin</div>
  <script>window.onload = () => window.print();</script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
