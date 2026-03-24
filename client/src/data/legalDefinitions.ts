/**
 * Legal term definitions for (?) tooltip bubbles in the wizard.
 * Key = term identifier; value = definition text (FR).
 * Use **text** for bold emphasis.
 */
export const LEGAL_DEFINITIONS: Record<string, string> = {
  particulier:
    "Être humain souhaitant défendre **ses propres intérêts**.",
  autre_entite:
    "Entité juridique (entreprise, professionnel, banque, assurance, administration) souhaitant défendre les **intérêts de cette entité**.",
  activite_professionnelle:
    "Un particulier peut agir en tant que professionnel (auto-entrepreneur, bailleur, artisan, plombier…).",
  // Legacy keys kept for backward compat
  personne_physique:
    "Être humain souhaitant défendre **ses propres intérêts**.",
  personne_morale:
    "Entité juridique (entreprise, professionnel, banque, assurance, administration) souhaitant défendre les **intérêts de cette entité**.",
};

export type LegalDefinitionKey = keyof typeof LEGAL_DEFINITIONS;
