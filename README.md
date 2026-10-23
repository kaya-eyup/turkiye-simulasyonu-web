# Türkiye Simülasyonu

Türkiye'ye özgü yemekleri, şehirleri, adetleri ve absürtlükleri puanlama ve yorumlama platformu. React + TypeScript + Vite; veri katmanında TanStack Query ve zod.

## Çalıştırma

Veri [turkiye-simulasyonu-api](https://github.com/kaya-eyup/turkiye-simulasyonu-api)'den gelir; iki program aynı anda açık olmalı.

1. **API:** Visual Studio'da `https` profiliyle F5 (ya da `dotnet run --launch-profile https`) → `https://localhost:7129`
2. **Web:** `npm install`, ardından `npm run dev` → `http://localhost:5173`

API kapalıysa veri sayfaları "Sunucuya ulaşılamadı" gösterir. Geliştirmede API'nin CORS izin listesinde yalnızca `http://localhost:5173` var; sayfa başka bir adresten (ör. `http://127.0.0.1:5173`) açılırsa istekler tarayıcıda engellenir.

Kontroller: `npm run typecheck` · `npm run lint` · `npm run format:check` · `npm run build` (build, `tsc -b` geçmeden çalışmaz).

## Canlı sürüm

https://turkiye-simulasyonu-web.vercel.app — veri canlı API'den gelir: https://turkiye-simulasyonu-api.runasp.net ([turkiye-simulasyonu-api](https://github.com/kaya-eyup/turkiye-simulasyonu-api)).

- Vercel'de `VITE_API_URL` yalnızca Production ortamında tanımlı. Vite bu değeri derleme anında JS dosyasına yazar; tarayıcı Vercel'in ayarlarını okumaz. Değer değişirse yeniden derleme (Redeploy) gerekir.
- Önizleme (Preview) dağıtımlarında değişken yok ve API'nin CORS izni yalnızca ana adreste; önizlemeler "veri sunucusu bağlı değil" uyarısı gösterir.
- API ücretsiz bir sunucuda: Bir süre istek gelmeyince uyuyor, uzun bir aradan sonraki ilk sayfa yavaş açılabilir.

Geçmiş karar: Backend gelene kadar canlı sürüm için statik JSON adaptörü yazılmadı; site o süre demo uyarısı gösterdi. Adaptör sadece silinmek için yaşayacaktı.

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

| Uç nokta                                 | Beklenti                                                                                                                                      |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /categories`                        | `order`'a göre sıralı                                                                                                                         |
| `GET /categories/:id` · `GET /items/:id` | kayıt yoksa 404                                                                                                                               |
| `GET /items?categoryId=`                 | kategorinin öğeleri                                                                                                                           |
| `GET /items?q=&page=`                    | **arama sunucuda** (bugün istemcide yapılıyor), Türkçe karakter duyarsız; `{ items, total, totalPages }`                                      |
| `GET /comments?itemId=`                  | yeniden eskiye sıralı                                                                                                                         |
| `POST /comments`                         | gövde `{ itemId, author, body }`, `Content-Type: application/json`; 201 + oluşturulan kayıt                                                   |
| `GET /items/featured`                    | son 7 günde en çok yorum alan 4 öğe; hesap sunucuda (SQL GROUP BY), istemciye bütün yorumlar indirilmez                                       |
| `GET /surveys/rebirth`                   | `{ total, results: [{ country, count }] }`; çoktan aza sıralı, sayım sunucuda (SQL GROUP BY)                                                  |
| `PUT /surveys/rebirth/my-vote`           | gövde `{ country }` (ISO 3166 alfa-2 kodu, ör. `DE`); kişi başı tek oy, sonradan değiştirilebilir; sunucu kodu geçerli listeye karşı doğrular |

1. Liste uç noktaları sıralı döner; sıralama ve sayfalama aynı yerde, sunucuda yapılır.
2. `id` ve `createdAt` sunucuda üretilir.
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
