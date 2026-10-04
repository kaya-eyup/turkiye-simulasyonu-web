# Türkiye Simülasyonu

Türkiye'ye özgü yemekleri, şehirleri, adetleri ve absürtlükleri puanlama ve yorumlama platformu. React + TypeScript + Vite; veri katmanında TanStack Query ve zod.

## Çalıştırma

```
npm install
npm run dev:all   # API (json-server) :3000 + web (Vite) :5173
```

Sadece `npm run dev` çalıştırılırsa API kapalı olur ve veri sayfaları "Sunucuya ulaşılamadı" gösterir.

Kontroller: `npm run typecheck` · `npm run lint` · `npm run format:check` · `npm run build` (build, `tsc -b` geçmeden çalışmaz).

## Canlı sürüm

https://turkiye-simulasyonu-web.vercel.app — **veri sunucusu henüz bağlı değil.** Geliştirmede veri json-server'dan gelir; canlıda `VITE_API_URL` tanımlı olmadığı için sayfalar demo uyarısı gösterir. ASP.NET Core backend'i bağlandığında değişen tek şey bu değişken olacak.

Bilinçli karar: canlı sürüm için statik JSON adaptörü yazılmadı. Backend birkaç hafta içinde geleceği için adaptör sadece silinmek için yaşayacaktı.

## Yapı

```
src/
  app/        router, layout, query client
  features/   categories, items, search, comments, votes, theme, home, about
  shared/     api (client, endpoints, queries, schemas), hooks, lib, ui
```

- Sunucuya giden tek kapı `shared/api/client.ts` (`request` → `getJson` / `postJson`); her yanıt zod'dan geçer.
- Sunucu verisi TanStack Query'de; arama ve sayfa numarası URL'de (`?q=`, `?page=`); tema ve "benim oylarım" context + localStorage'da.
- Oylar istemcide tutulur ve sunucudaki dağılımın üstüne bindirilir; sunucuya yazılmaz.
- Sayfa seviyesinde hata ekranı: bir sayfa çökerse NavBar ayakta kalır.

## Backend sözleşmesi

| Uç nokta                                 | Beklenti                                                                                                 |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `GET /categories`                        | `order`'a göre sıralı                                                                                    |
| `GET /categories/:id` · `GET /items/:id` | kayıt yoksa 404                                                                                          |
| `GET /items?categoryId=`                 | kategorinin öğeleri                                                                                      |
| `GET /items?q=&page=`                    | **arama sunucuda** (bugün istemcide yapılıyor), Türkçe karakter duyarsız; `{ items, total, totalPages }` |
| `GET /comments?itemId=`                  | yeniden eskiye sıralı                                                                                    |
| `POST /comments`                         | gövde `{ itemId, author, body }`, `Content-Type: application/json`; 201 + oluşturulan kayıt              |
| `GET /items/featured`                    | son 7 günde en çok yorum alan 4 öğe; hesap sunucuda (SQL GROUP BY), istemciye bütün yorumlar indirilmez  |

1. Liste uç noktaları sıralı döner; sıralama ve sayfalama aynı yerde, sunucuda yapılır.
2. `id` ve `createdAt` sunucuda üretilir (bugün `createdAt`'i istemci gönderiyor, çünkü json-server atayamıyor).
3. POST, oluşturulan kaydı döndürür.
4. Doğrulama sunucuda tekrar yapılır: `author` en fazla 30 karakter (boşsa "anonim"), `body` kırpıldıktan sonra 3-500 karakter.
5. Oylar: `votes(userId, itemId, score)` + `(userId, itemId)` tekillik kısıtı; dağılım `UPDATE ... SET n = n + 1` ile artırılır (bugünkü okuma-değiştirme-yazma yarışını ortadan kaldırır). Kullanıcı girişi gerektirir.

## Bilinçli borçlar

- Öğe `id`'si slug: ad değişirse linkler kırılır. Gerçek veritabanında değişmeyen bir anahtar + ayrı `slug` sütunu.
- Oylar sadece tarayıcıda; tekrar oy vermeyi arayüz engeller, sunucu engellemez.
- Kategori sayfası sıralaması ham ortalamayla, oy katmanı hesaba katılmıyor.
- Test yok. İlk adaylar: `votesReducer`, `applyMyVote`, `summarize`, `storage`, `toUserMessage`.
- Hata ekranı sayfa seviyesinde; tek bir kart çökünce bütün sayfa hata gösterir.
- Tema FOUC: kayıtlı tema, JS yüklenene kadar uygulanmıyor.
- Sekmeler arası oy senkronu yok.
