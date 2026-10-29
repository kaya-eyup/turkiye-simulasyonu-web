// Sunucudaki Surveys/Countries.cs ile aynı 249 kod (ISO 3166-1 alfa-2).
// Liste burada sadece seçenekleri çizmek için var; geçerliliğin son sözü sunucuda.
// Tablo hâlinde kalsın diye Prettier bu diziyi satır satır açmıyor
// prettier-ignore
const COUNTRY_CODES = [
  "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR", "AS", "AT",
  "AU", "AW", "AX", "AZ", "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI",
  "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS", "BT", "BV", "BW", "BY",
  "BZ", "CA", "CC", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN",
  "CO", "CR", "CU", "CV", "CW", "CX", "CY", "CZ", "DE", "DJ", "DK", "DM",
  "DO", "DZ", "EC", "EE", "EG", "EH", "ER", "ES", "ET", "FI", "FJ", "FK",
  "FM", "FO", "FR", "GA", "GB", "GD", "GE", "GF", "GG", "GH", "GI", "GL",
  "GM", "GN", "GP", "GQ", "GR", "GS", "GT", "GU", "GW", "GY", "HK", "HM",
  "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IR",
  "IS", "IT", "JE", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN",
  "KP", "KR", "KW", "KY", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS",
  "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MH", "MK",
  "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW",
  "MX", "MY", "MZ", "NA", "NC", "NE", "NF", "NG", "NI", "NL", "NO", "NP",
  "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM",
  "PN", "PR", "PS", "PT", "PW", "PY", "QA", "RE", "RO", "RS", "RU", "RW",
  "SA", "SB", "SC", "SD", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM",
  "SN", "SO", "SR", "SS", "ST", "SV", "SX", "SY", "SZ", "TC", "TD", "TF",
  "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW",
  "TZ", "UA", "UG", "UM", "US", "UY", "UZ", "VA", "VC", "VE", "VG", "VI",
  "VN", "VU", "WF", "WS", "YE", "YT", "ZA", "ZM", "ZW",
] as const;

// Adlar elle yazılmıyor: tarayıcının içindeki Unicode verisinden (CLDR) Türkçe gelir
const displayNames = new Intl.DisplayNames(["tr"], { type: "region" });

// Uzun resmî adların düğmeye sığan kısa hâli; listede tam ad kalır
const SHORT_NAMES: Partial<Record<string, string>> = {
  US: "ABD",
  AE: "BAE",
};

export function countryName(code: string): string {
  return displayNames.of(code) ?? code;
}

export function shortCountryName(code: string): string {
  return SHORT_NAMES[code] ?? countryName(code);
}

// "TR" → 🇹🇷: her harf, Unicode'daki "bölge göstergesi" harfine kaydırılır
// (A → U+1F1E6). İki gösterge yan yana gelince yazı tipi bayrağı çizer.
const REGIONAL_INDICATOR_A = 0x1f1e6;

export function flagEmoji(code: string): string {
  return String.fromCodePoint(
    ...[...code.toUpperCase()].map(
      (letter) => REGIONAL_INDICATOR_A + letter.charCodeAt(0) - 65,
    ),
  );
}

// Tek dokunuşla seçilen çipler. Sıra bilinçli: sonuçları değil, merakı yansıtıyor.
export const POPULAR_COUNTRIES = [
  "TR",
  "JP",
  "CA",
  "CH",
  "NO",
  "DE",
  "NZ",
  "IT",
  "NL",
  "US",
] as const;

// Açılır liste için: Türkçe alfabeye göre (Ç, İ, Ö, Ş, Ü doğru yerde)
const collator = new Intl.Collator("tr");

export const ALL_COUNTRIES = COUNTRY_CODES.map((code) => ({
  code,
  name: countryName(code),
})).sort((a, b) => collator.compare(a.name, b.name));

export const TURKIYE = "TR";
