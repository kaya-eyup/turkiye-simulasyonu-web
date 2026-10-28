# Türkiye Simülasyonu

[![CI](https://github.com/kaya-eyup/turkiye-simulasyonu-web/actions/workflows/ci.yml/badge.svg)](https://github.com/kaya-eyup/turkiye-simulasyonu-web/actions/workflows/ci.yml)

**Canlı:** https://turkiyesimulasyonu.eyupkaya.com · **API:** [turkiye-simulasyonu-api](https://github.com/kaya-eyup/turkiye-simulasyonu-api)

Türkiye'ye özgü yemekleri, şehirleri, adetleri ve absürtlükleri puanlama ve yorumlama platformu. React + TypeScript + Vite; veri katmanında TanStack Query ve zod.

## Çalıştırma

Veri [turkiye-simulasyonu-api](https://github.com/kaya-eyup/turkiye-simulasyonu-api)'den gelir; iki program aynı anda açık olmalı.

1. **API:** Visual Studio'da `https` profiliyle F5 (ya da `dotnet run --launch-profile https`) → `https://localhost:7129`
2. **Web:** `npm install`, ardından `npm run dev` → `http://localhost:5173`

Geliştirmede API adresi `.env.development` dosyasından gelir (`VITE_API_URL=https://localhost:7129`); dosyada gizli bir şey yok, depoda duruyor.

API kapalıysa veri sayfaları "Sunucuya ulaşılamadı" gösterir. Geliştirmede API'nin CORS izin listesinde yalnızca `http://localhost:5173` var; sayfa başka bir adresten (ör. `http://127.0.0.1:5173`) açılırsa istekler tarayıcıda engellenir.

Kontroller: `npm run typecheck` · `npm run lint` · `npm run format:check` · `npm run build` (build, `tsc -b` geçmeden çalışmaz).

## Canlı sürüm

https://turkiyesimulasyonu.eyupkaya.com (Cloudflare) — veri canlı API'den gelir: https://turkiye-simulasyonu-api.runasp.net ([turkiye-simulasyonu-api](https://github.com/kaya-eyup/turkiye-simulasyonu-api)). Yedek: https://turkiye-simulasyonu-web.vercel.app

- `VITE_API_URL` yalnızca Production ortamında ve **derleme değişkeni** olarak tanımlı (her iki platformda). Vite bu değeri derleme anında JS dosyasına yazar; tarayıcı platformun ayarlarını okumaz. Değer değişirse yeniden derleme gerekir.
- Önizleme (Preview) dağıtımlarında değişken yok ve API'nin CORS izni yalnızca üç ana adreste (özel alan adı, `workers.dev`, `vercel.app`); önizlemeler "veri sunucusu bağlı değil" uyarısı gösterir.
- API ücretsiz bir sunucuda: Bir süre istek gelmeyince uyuyor, uzun bir aradan sonraki ilk sayfa yavaş açılabilir.
- **Neden Cloudflare:** Ekim 2026'da Türk Telekom hattında `*.vercel.app` adreslerine bağlantı aralıklı olarak sıfırlanıyordu (`ERR_CONNECTION_RESET`); VPN ile, Turkcell ve Vodafone'da açılıyordu. Ana adres bu yüzden Cloudflare'a taşındı, Vercel yedek olarak duruyor.

Geçmiş karar: Backend gelene kadar canlı sürüm için statik JSON adaptörü yazılmadı; site o süre demo uyarısı gösterdi. Adaptör sadece silinmek için yaşayacaktı.

## Yapı

```
src/
  app/        router, layout, query client
  features/   categories, items, search, comments, votes, theme, home, about
  shared/     api (client, endpoints, queries, schemas), hooks, lib, ui
```

- Sunucuya giden tek kapı `shared/api/client.ts` (`request` → `getJson` / `postJson`); her yanıt zod'dan geçer.
- Sunucu verisi TanStack Query'de; arama ve sayfa numarası URL'de (`?q=`, `?sayfa=`); tema ve "benim oylarım" context + localStorage'da.
- Oylar istemcide tutulur ve sunucudaki dağılımın üstüne bindirilir; sunucuya yazılmaz.
- Sayfa seviyesinde hata ekranı: bir sayfa çökerse NavBar ayakta kalır.

## Backend sözleşmesi

| Uç nokta                                 | Beklenti                                                                                                                                                                                                                | Durum |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| `GET /categories`                        | `order`'a göre sıralı                                                                                                                                                                                                   | Hazır |
| `GET /categories/:id` · `GET /items/:id` | kayıt yoksa 404                                                                                                                                                                                                         | Hazır |
| `GET /items?categoryId=`                 | kategorinin öğeleri                                                                                                                                                                                                     | Hazır |
| `GET /items/search?q=&page=`             | arama sunucuda, Türkçe karakter duyarsız; `{ items, total, totalPages }`, sayfa başına 12 öğe _(adres `/items`'tan ayrıldı: `/items` sayfalanmamış tam liste dönüyor, aynı uçtan iki farklı gövde şekli dönmesin diye)_ | Hazır |
| `GET /comments?itemId=`                  | yeniden eskiye sıralı                                                                                                                                                                                                   | Hazır |
| `POST /comments`                         | gövde `{ itemId, author, body }`, `Content-Type: application/json`; 201 + oluşturulan kayıt                                                                                                                             | Hazır |
| `GET /items/featured`                    | her zaman 5 öğe: son 7 günde en çok yorum alanlar, eksik kalırsa rastgele dolgu; hesap sunucuda (SQL GROUP BY), istemciye bütün yorumlar indirilmez                                                                     | Hazır |
| `GET /surveys/rebirth`                   | `{ total, results: [{ country, count }] }`; çoktan aza sıralı, sayım sunucuda (SQL GROUP BY)                                                                                                                            | Yok   |
| `PUT /surveys/rebirth/my-vote`           | gövde `{ country }` (ISO 3166 alfa-2 kodu, ör. `DE`); kişi başı tek oy, sonradan değiştirilebilir; sunucu kodu geçerli listeye karşı doğrular                                                                           | Yok   |

1. Liste uç noktaları sıralı döner; sıralama ve sayfalama aynı yerde, sunucuda yapılır.
2. `id` ve `createdAt` sunucuda üretilir.
3. POST, oluşturulan kaydı döndürür.
4. Doğrulama sunucuda tekrar yapılır: `author` en fazla 30 karakter (boşsa "anonim"), `body` kırpıldıktan sonra 3-500 karakter.
5. Oylar: `votes(userId, itemId, score)` + `(userId, itemId)` tekillik kısıtı; dağılım `UPDATE ... SET n = n + 1` ile artırılır (bugünkü okuma-değiştirme-yazma yarışını ortadan kaldırır). Kullanıcı girişi gerektirir. _Durum: yok._

## Bilinçli borçlar

- Öğe `id`'si slug: ad değişirse linkler kırılır. Gerçek veritabanında değişmeyen bir anahtar + ayrı `slug` sütunu.
- Oylar sadece tarayıcıda; tekrar oy vermeyi arayüz engeller, sunucu engellemez.
- Kategori sayfası sıralaması ham ortalamayla, oy katmanı hesaba katılmıyor.
- Test yok. İlk adaylar: `votesReducer`, `applyMyVote`, `summarize`, `storage`, `toUserMessage`.
- Hata ekranı sayfa seviyesinde; tek bir kart çökünce bütün sayfa hata gösterir.
- Tema FOUC: kayıtlı tema, JS yüklenene kadar uygulanmıyor.
- Sekmeler arası oy senkronu yok.
