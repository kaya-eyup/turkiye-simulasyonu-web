# Türkiye Simülasyonu

[![CI](https://github.com/kaya-eyup/turkiye-simulasyonu-web/actions/workflows/ci.yml/badge.svg)](https://github.com/kaya-eyup/turkiye-simulasyonu-web/actions/workflows/ci.yml)

**Canlı:** https://turkiyesimulasyonu.eyupkaya.com · **API:** [turkiye-simulasyonu-api](https://github.com/kaya-eyup/turkiye-simulasyonu-api) ([Swagger belgesi](https://turkiye-simulasyonu-api.runasp.net/swagger))

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
  features/   categories, items, search, comments, votes, survey, theme, home, about
  shared/     api (client, endpoints, queries, schemas), hooks, lib, ui
```

- Sunucuya giden tek kapı `shared/api/client.ts` (`request` → `getJson / postJson / putJson / deleteResource`); her yanıt zod'dan geçer. `deleteResource` ayrı duruyor çünkü 204 cevabında ayrıştırılacak gövde yok.
- Sunucu verisi TanStack Query'de; arama ve sayfa numarası URL'de (`?q=`, `?sayfa=`); localStorage'da yalnızca tema ve oy veren kimliği kalıyor.
- Bütün oylar sunucuda. Tarayıcı ilk ziyarette `crypto.randomUUID()` ile bir kimlik üretip localStorage'da saklıyor (`tsim:voter-id:v1`) ve sadece oy uçlarına `X-Voter-Id` başlığıyla ekliyor; listeler herkese aynı cevabı döndüğü için bu başlığı taşımıyor.
- Öğe oyu verilince hem `my-votes` hem öğe sorguları geçersiz kılınıp sunucudan yeniden okunuyor; dağılım istemcide tahmin edilmiyor, çünkü bu arada başkasının oyu da girmiş olabilir. `invalidateQueries`'in promise'i döndürüldüğü için mutation yeni sayılar gelene kadar "pending" kalıyor: düğmeler o sürede kapalı.
- `my-votes` tek sorgu, tek anahtar (`["itemVotes", "mine"]`): NavBar hep ekranda olduğu için sorgu her sayfada canlı, öğe sayfası ve "Oylarım" rozeti aynı önbellekten okuyor. Her kart kendi oyunu ayrıca sormuyor.
- Anket sonuçları oy vermeden gösterilmiyor.
- Bayraklar emoji: `"TR"` → 🇹🇷. Windows'taki Chrome/Edge bayrak emojisi çizemediği için `country-flag-emoji-polyfill` yalnızca o tarayıcılarda bayrak yazı tipini (78 KB, sitenin kendi dosyası, CDN değil) yükler. Ülke adları `Intl.DisplayNames` ile Türkçe, sıralama `Intl.Collator("tr")` ile.
- Anket grafiği kütüphanesiz SVG: dilim başına bir `<circle>` (`stroke-dasharray`). Renkler sıraya göre; ülkeyi renk değil bayrak tanıtır (en çok oy alan bayrakların çoğu kırmızı-beyaz). Türkiye her zaman bayrak kırmızısı ve ilk 5'te olmasa da kendi sırasıyla görünür.
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
| `GET /items/featured`                    | her zaman 5 öğe: bu takvim haftası yorum almış öğelerden haftalık sabit bir seçki, eksik kalırsa rastgele dolgu; hesap sunucuda, istemciye bütün yorumlar indirilmez                                                    | Hazır |
| `GET /items/my-votes`                    | `X-Voter-Id` başlığıyla; `[{ itemId, stars }]`, oy yoksa `[]`                                                                                                                                                           | Hazır |
| `PUT /items/:id/my-vote`                 | gövde `{ stars }` (1-5), `X-Voter-Id` başlığıyla; 200 + `{ itemId, stars }`. Sunucu oy satırını ve öğenin dağılım sayaçlarını aynı transaction'da yazar                                                                 | Hazır |
| `DELETE /items/:id/my-vote`              | `X-Voter-Id` başlığıyla; 204, oy zaten yoksa da                                                                                                                                                                         | Hazır |
| `GET /surveys/rebirth`                   | `{ total, results: [{ country, count }] }`; çoktan aza sıralı, sayım sunucuda (SQL GROUP BY)                                                                                                                            | Hazır |
| `GET /surveys/rebirth/my-vote`           | `X-Voter-Id` başlığıyla; 200 + `{ country }`, henüz oy yoksa 404                                                                                                                                                        | Hazır |
| `PUT /surveys/rebirth/my-vote`           | gövde `{ country }` (ISO 3166 alfa-2 kodu, ör. `DE`), `X-Voter-Id` başlığıyla; tarayıcı başına tek oy, sonradan değiştirilebilir; sunucu kodu geçerli listeye karşı doğrular                                            | Hazır |

1. Liste uç noktaları sıralı döner; sıralama ve sayfalama aynı yerde, sunucuda yapılır.
2. `id` ve `createdAt` sunucuda üretilir.
3. POST, oluşturulan kaydı döndürür.
4. Doğrulama sunucuda tekrar yapılır: `author` en fazla 30 karakter (boşsa "anonim"), `body` kırpıldıktan sonra 3-500 karakter.
5. Oylar: `ItemVotes(voterId, itemId, stars)` + `(voterId, itemId)` tekillik kısıtı; dağılım `UPDATE ... SET n = n + 1` ile kaydırılır. _Durum: hazır; kullanıcı girişi yerine anonim kimlik._

## Bilinçli borçlar

- Adreslerde öğe slug'ı kullanılıyor: API'de tablolar arası bağlar değişmeyen sayı anahtarına kurulu, ama slug düzeltilirse eski linkler 404 olur. Gerçek çözüm eski slug'dan yenisine yönlendirme.
- Oy veren kimliği anonim: Tarayıcı verisini silen biri tekrar oy verebilir. Giriş gelince oylar kullanıcıya bağlanacak.
- Oy verilince bütün öğe sorguları geçersiz kılınıyor; kategori listesi açıkken oy verilirse liste de yeniden çekiliyor. 1224 öğede bedeli yok, ama doğru çözüm yalnızca değişen öğenin anahtarını geçersiz kılmak.
- Tarayıcıda kalan eski oy kaydı (`tsim:votes:v1`) açılışta siliniyor; bu temizlik satırı birkaç sürüm sonra kaldırılacak.
- Anket ülke listesi (249 kod) API'deki listenin kopyası; biri değişirse diğeri elle güncellenmeli. Geçersiz kodu yine de sunucu reddeder.
- Kategori sayfası sıralaması ham ortalamayla: çok oy almış öğeyle tek oy almış öğe aynı kefede.
- Test yok. İlk adaylar: `summarize`, `groupResults`, `storage`, `toUserMessage`.
- Hata ekranı sayfa seviyesinde; tek bir kart çökünce bütün sayfa hata gösterir.
- Tema FOUC: kayıtlı tema, JS yüklenene kadar uygulanmıyor.
- Sekmeler arası anlık senkron yok: ikinci sekme, odağa dönünce ve veri bayatlamışsa (60 sn) yeniden okuyor.
