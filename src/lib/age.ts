// Correction V1.1 — Section 2.1
// L'âge n'est jamais stocké, toujours calculé dynamiquement.

export function getAgeAtEditionStart(
  dateNaissance: Date,
  dateDebutEdition: Date
): number {
  const diff = dateDebutEdition.getTime() - dateNaissance.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

export function getAgeActuel(dateNaissance: Date): number {
  return getAgeAtEditionStart(dateNaissance, new Date());
}

export function getTrancheAge(age: number): string {
  if (age < 6) return "Moins de 6 ans";
  if (age <= 8) return "6-8 ans";
  if (age <= 10) return "9-10 ans";
  if (age <= 12) return "11-12 ans";
  return "Plus de 12 ans";
}
