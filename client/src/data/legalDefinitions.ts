/**
 * Legal term definitions for (?) tooltip bubbles in the wizard.
 * Key = term identifier; value = definition text (FR).
 * Use **text** for bold emphasis.
 */
export const LEGAL_DEFINITIONS: Record<string, string> = {
  particulier:
    "Être humain souhaitant défendre **ses propres intérêts**.",
  autre_entite:
    "Entité juridique souhaitant défendre les **intérêts de cette entité**.",
  activite_professionnelle:
    "Un particulier peut agir en tant que professionnel (auto-entrepreneur, bailleur, artisan, plombier…).",
  vie_personnelle:
    "Concerne votre situation en tant que **particulier** : achat ou vente, logement, divorce, licenciement, etc.",
  activite_pro_contexte:
    "Concerne une **activité que vous exercez** (entreprise, freelance, indépendant) : litige avec un client, un fournisseur, un partenaire ou lié à la gestion de votre activité, etc.",
  infos_accord:
    "mauvaise information, erreur sur le bien, tromperie, etc…",
  accord_non_respecte:
    "absence de paiement, absence de remise du bien, retard, etc…",
  // Legacy keys kept for backward compat
  personne_physique:
    "Être humain souhaitant défendre **ses propres intérêts**.",
  personne_morale:
    "Entité juridique (entreprise, professionnel, banque, assurance, administration) souhaitant défendre les **intérêts de cette entité**.",
  faute_licenciement:
    "Faute du salarié dans l'exercice de ses fonctions.",
  insuffisance_pro:
    "Incapacité du salarié à réaliser les tâches confiées / à atteindre les objectifs.",
  motif_economique:
    "Difficulté économique, réorganisation de l'entreprise…",
};

export type LegalDefinitionKey = keyof typeof LEGAL_DEFINITIONS;
