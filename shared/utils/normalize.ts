/**
 * Shared name normalization helpers.
 *
 * Used by:
 *  - the CNB CSV import script (to fill `nom_normalized` / `prenom_normalized`)
 *  - the lawyer signup matching API (to compare user-typed names against
 *    the directory)
 *
 * Both sides MUST use the same function, otherwise matches will silently fail.
 */

/**
 * Lowercase + strip accents + collapse whitespace + remove anything that's not
 * a letter/space/hyphen. Hyphens are kept (composite names like "Bickart-Magnes").
 */
export function normalizeName(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip combining diacritics
    .toLowerCase()
    .replace(/[^a-z\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Same for barreau (uppercase canonical form, e.g. "PARIS"). */
export function normalizeBarreau(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
