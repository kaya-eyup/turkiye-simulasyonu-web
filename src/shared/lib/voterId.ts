import { z } from "zod";
import { readStorage, writeStorage } from "./storage";

// Girişsiz v1: tarayıcı başına rastgele bir kimlik. Sunucu aynı kimliğin
// ikinci oyunu yeni oy değil, eski oyun değişikliği olarak işler.
// Bilinçli borç: Tarayıcı verisini silen kişi yeni kimlikle tekrar oy verebilir.
const VOTER_ID_KEY = "tsim:voter-id:v1";
const voterIdSchema = z.uuid();

// Kayıt engelliyse (gizli sekme, kapalı depolama) kimlik sekme açık kaldıkça
// bellekte yaşar: oy verilir ama sayfa yenilenince tarayıcı onu hatırlamaz.
let cached: string | null = null;

export function getVoterId(): string {
  if (cached !== null) return cached;

  const stored = readStorage(VOTER_ID_KEY, voterIdSchema);
  if (stored !== null) {
    cached = stored;
    return stored;
  }

  // Tarayıcının kendi güvenli rastgele üreteci; sunucu GUID biçimini doğruluyor
  const created = crypto.randomUUID();
  writeStorage(VOTER_ID_KEY, created);
  cached = created;
  return created;
}
