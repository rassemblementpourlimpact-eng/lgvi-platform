import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const runtime = "nodejs";

const CAT_LABELS: Record<string, string> = {
  FONCTIONNEMENT: "Fonctionnement", COMMUNICATION: "Communication",
  RESTAURATION: "Restauration", MATERIEL: "Matériel",
  LOGISTIQUE: "Logistique", ACTIVITES: "Activités", AUTRE: "Autre",
};

function fmt(n: number) {
  return new Intl.NumberFormat("fr-BJ", { style: "currency", currency: "XOF", minimumFractionDigits: 0 }).format(n);
}

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const editionId = searchParams.get("editionId");
  if (!editionId) return NextResponse.json({ error: "editionId requis" }, { status: 400 });

  const [edition, paiementsStats, paiements, depenses] = await Promise.all([
    prisma.edition.findUnique({ where: { id: editionId }, include: { budgetPrevisionnel: true } }),
    prisma.paiement.aggregate({
      where: { editionId, statut: { in: ["paye", "partiel"] } },
      _sum: { montantPaye: true, montant: true },
      _count: true,
    }),
    prisma.paiement.findMany({
      where: { editionId },
      include: { participant: { select: { prenom: true, nom: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.depense.findMany({ where: { editionId }, orderBy: { date: "asc" } }),
  ]);

  if (!edition) return NextResponse.json({ error: "Édition introuvable" }, { status: 404 });

  const recettes = paiementsStats._sum.montantPaye ?? 0;
  const totalDepenses = depenses.reduce((acc, d) => acc + d.montant, 0);
  const solde = recettes - totalDepenses;

  const STATUT_STYLE: Record<string, string> = {
    paye: "color:#16a34a;font-weight:600",
    partiel: "color:#92400e",
    en_attente: "color:#dc2626",
    annule: "color:#94a3b8",
    rembourse: "color:#94a3b8",
  };
  const STATUT_LABEL: Record<string, string> = {
    paye: "Payé", partiel: "Partiel", en_attente: "En attente",
    annule: "Annulé", rembourse: "Remboursé",
  };

  const lignesPaiements = paiements.map((p, i) =>
    `<tr style="background:${i % 2 === 0 ? "#fff" : "#f8fafc"}">
      <td style="padding:7px 10px;border-bottom:1px solid #e2e8f0">${p.participant.prenom} ${p.participant.nom}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #e2e8f0;text-align:right">${fmt(p.montant)}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #e2e8f0;text-align:right">${fmt(p.montantPaye)}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #e2e8f0;${STATUT_STYLE[p.statut] ?? ""}">${STATUT_LABEL[p.statut] ?? p.statut}</td>
    </tr>`
  ).join("");

  const lignesDepenses = depenses.map((d, i) =>
    `<tr style="background:${i % 2 === 0 ? "#fff" : "#f8fafc"}">
      <td style="padding:7px 10px;border-bottom:1px solid #e2e8f0">${new Date(d.date).toLocaleDateString("fr-BJ")}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #e2e8f0">${d.description}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #e2e8f0">${CAT_LABELS[d.categorie] ?? d.categorie}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:600">${fmt(d.montant)}</td>
    </tr>`
  ).join("");

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Rapport financier — ${edition.nom}</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12px; color: #1e293b; margin: 20px; }
    h1 { font-size: 18px; color: #1e3a5f; margin-bottom: 2px; }
    h2 { font-size: 14px; color: #1e3a5f; margin: 24px 0 8px; }
    p.sub { color: #64748b; margin: 0 0 16px; font-size: 11px; }
    .kpi { display: flex; gap: 16px; margin-bottom: 24px; }
    .kpi-card { flex: 1; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; }
    .kpi-card .val { font-size: 20px; font-weight: 800; margin-bottom: 2px; }
    .kpi-card .lbl { font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: .5px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
    thead tr { background: #1e3a5f; color: white; }
    th { padding: 8px 10px; text-align: left; font-size: 11px; }
    .footer { margin-top: 24px; color: #94a3b8; font-size: 10px; text-align: right; border-top: 1px solid #e2e8f0; padding-top: 8px; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <h1>Rapport financier — ${edition.nom}</h1>
  <p class="sub">Généré le ${new Date().toLocaleDateString("fr-BJ")} · ${paiementsStats._count} paiement${paiementsStats._count > 1 ? "s" : ""}</p>

  <div class="kpi">
    <div class="kpi-card">
      <div class="val" style="color:#16a34a">${fmt(recettes)}</div>
      <div class="lbl">Recettes collectées</div>
    </div>
    <div class="kpi-card">
      <div class="val" style="color:#dc2626">${fmt(totalDepenses)}</div>
      <div class="lbl">Total dépenses</div>
    </div>
    <div class="kpi-card">
      <div class="val" style="color:${solde >= 0 ? "#16a34a" : "#dc2626"}">${fmt(solde)}</div>
      <div class="lbl">${solde >= 0 ? "Excédent" : "Déficit"}</div>
    </div>
  </div>

  <h2>Paiements</h2>
  <table>
    <thead><tr><th>Participant</th><th style="text-align:right">Montant dû</th><th style="text-align:right">Payé</th><th>Statut</th></tr></thead>
    <tbody>${lignesPaiements || '<tr><td colspan="4" style="padding:8px;color:#94a3b8">Aucun paiement</td></tr>'}</tbody>
  </table>

  <h2>Dépenses</h2>
  <table>
    <thead><tr><th>Date</th><th>Description</th><th>Catégorie</th><th style="text-align:right">Montant</th></tr></thead>
    <tbody>${lignesDepenses || '<tr><td colspan="4" style="padding:8px;color:#94a3b8">Aucune dépense</td></tr>'}</tbody>
  </table>

  <div class="footer">LGVI — Les Grandes Vacances de l'Impact · Cotonou, Bénin</div>
  <script>window.onload = () => window.print();</script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
