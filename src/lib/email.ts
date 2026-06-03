import { Resend } from "resend";

const FROM = "LGVI <noreply@lgvi.bj>";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function sendConfirmationInscription({
  to,
  prenomParent,
  prenomEnfant,
  reference,
  activite,
}: {
  to: string;
  prenomParent: string;
  prenomEnfant: string;
  reference: string;
  activite: string;
}) {
  const resend = getResend();
  if (!resend) return;

  const whatsappMsg = encodeURIComponent(
    `Bonjour LGVI, je viens d'inscrire ${prenomEnfant} (Réf: ${reference}). Pouvez-vous confirmer la réception ?`
  );
  const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_LGVI_WHATSAPP_NUMBER}?text=${whatsappMsg}`;

  return resend.emails.send({
    from: FROM,
    to,
    subject: `Inscription confirmée — ${prenomEnfant} | LGVI`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e3a5f;">Bonjour ${prenomParent},</h2>
        <p>L'inscription de <strong>${prenomEnfant}</strong> à l'activité <strong>${activite}</strong> a bien été enregistrée.</p>
        <p><strong>Référence :</strong> ${reference}</p>
        <hr style="border-color: #e2e8f0; margin: 24px 0;" />
        <a href="${whatsappUrl}" style="display: inline-block; background: #25d366; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
          Contacter LGVI sur WhatsApp
        </a>
        <p style="color: #64748b; font-size: 14px; margin-top: 24px;">
          Les Grandes Vacances de l'Impact — Cotonou, Bénin
        </p>
      </div>
    `,
  });
}

export async function sendRelancePaiement({
  to,
  prenomParent,
  prenomEnfant,
  montantRestant,
  reference,
}: {
  to: string;
  prenomParent: string;
  prenomEnfant: string;
  montantRestant: number;
  reference: string;
}) {
  const resend = getResend();
  if (!resend) return;

  return resend.emails.send({
    from: FROM,
    to,
    subject: `Rappel paiement — ${prenomEnfant} | LGVI`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f97316;">Rappel de paiement</h2>
        <p>Bonjour ${prenomParent},</p>
        <p>Un solde de <strong>${montantRestant.toLocaleString("fr-BJ")} FCFA</strong> reste dû pour l'inscription de <strong>${prenomEnfant}</strong> (Réf: ${reference}).</p>
        <p>Merci de régulariser votre situation dès que possible.</p>
        <p style="color: #64748b; font-size: 14px; margin-top: 24px;">
          Les Grandes Vacances de l'Impact — Cotonou, Bénin
        </p>
      </div>
    `,
  });
}
