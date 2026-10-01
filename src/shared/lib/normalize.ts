export function normalizeForSearch(input: string): string {
  return input
    .toLocaleLowerCase("tr") // İ -> i, I -> ı, Ç -> ç
    .replace(/ı/g, "i") // ı -> i (ayrışacak bir diacritic olmadığı için elle)
    .normalize("NFD") // ç -> c + ̧
    .replace(/\p{Diacritic}/gu, ""); // işaretleri tamamen yok et
}
