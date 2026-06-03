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
      where: { editionId },
      include: {
        parent: true,
        paiements: { orderBy: { createdAt: "desc" }, take: 1 },
        activites: { include: { activite: { select: { nom: true } } }, take: 1 },
      },
      orderBy: [{ nom: "asc" }, { prenom: "asc" }],
    }),
  ]);

  if (!edition) return NextResponse.json({ error: "Édition introuvable" }, { status: 404 });

  const STATUT_LABEL: Record<string, string> = {
    paye: "Payé", partiel: "Partiel", en_attente: "En attente",
    annule: "Annulé", rembourse: "Remboursé",
  };

  const lignes = participants.map((p, i) => {
    const age = getAgeAtEditionStart(p.dateNaissance, edition.dateDebut);
    const paiement = p.paiements[0];
    const activite = p.activites[0]?.activite?.nom ?? "—";
    const statut = paiement ? (STATUT_LABEL[paiement.statut] ?? paiement.statut) : "En attente";
    return `
      <tr style="background:${i % 2 === 0 ? "#ffffff" : "#f8fafc"}">
        <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0">${i + 1}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;font-weight:600">${p.prenom} ${p.nom}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0">${p.sexe === "M" ? "G" : "F"}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0">${age} ans</td>
        <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0">${activite}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0">${p.parent.telephonePrincipal}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;color:${paiement?.statut === "paye" ? "#16a34a" : paiement?.statut === "en_attente" ? "#dc2626" : "#92400e"}">${statut}</td>
      </tr>`;
  }).join("");

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Liste participants — ${edition.nom}</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12px; color: #1e293b; margin: 20px; }
    h1 { font-size: 18px; color: #1e3a5f; margin-bottom: 4px; }
    p.sub { color: #64748b; margin: 0 0 16px; font-size: 11px; }
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: #1e3a5f; color: white; }
    th { padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: .5px; }
    .footer { margin-top: 20px; color: #94a3b8; font-size: 10px; text-align: right; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <h1>Liste des participants — ${edition.nom}</h1>
  <p class="sub">${participants.length} participant${participants.length > 1 ? "s" : ""} · Généré le ${new Date().toLocaleDateString("fr-BJ")}</p>
  <table>
    <thead>
      <tr>
        <th>#</th><th>Nom / Prénom</th><th>Sexe</th><th>Âge</th>
        <th>Activité</th><th>Téléphone parent</th><th>Paiement</th>
      </tr>
    </thead>
    <tbody>${lignes}</tbody>
  </table>
  <div class="footer">LGVI — Les Grandes Vacances de l'Impact · Cotonou, Bénin</div>
  <script>window.onload = () => window.print();</script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
