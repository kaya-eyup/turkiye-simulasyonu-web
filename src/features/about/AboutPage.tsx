const linkClass = "underline underline-offset-4 hover:text-tea";

export const AboutPage = () => {
  return (
    <div className="max-w-prose">
      <h1>Hakkında</h1>
      <p className="mt-4">
        Türkiye Simülasyonu, Türkiye'ye özgü yemekleri, şehirleri, adetleri ve
        absürtlükleri puanlayıp yorumladığın bir geri bildirim ekranı.
        Simülasyonu bitirdin; şimdi deneyimini değerlendirme zamanı. Yeniden
        başlatma hakkın olsaydı nerede doğmak isteyeceğini soran bir anket de
        var.
      </p>
      <p className="mt-4">
        Bir öğrenme projesi. Arayüz React, TypeScript, TanStack Query ve
        Tailwind ile; sunucu ASP.NET Core Web API ve SQL Server ile yazıldı.
      </p>
      <p className="mt-4">
        Kaynak kodu:{" "}
        <a
          href="https://github.com/kaya-eyup/turkiye-simulasyonu-web"
          target="_blank"
          rel="noreferrer"
          className={linkClass}
        >
          arayüz
        </a>{" "}
        ·{" "}
        <p className="mt-4">
          Öneri ve geri bildirimlerini{" "}
          <a href="mailto:iletisim@eyupkaya.com" className={linkClass}>
            e-posta
          </a>{" "}
          ile gönderebilirsin. Geliştirici:{" "}
          <a
            href="https://www.linkedin.com/in/eyupkaya-dev/"
            target="_blank"
            rel="noreferrer"
            className={linkClass}
          >
            Eyüp Kaya, LinkedIn
          </a>
        </p>
        <a
          href="https://github.com/kaya-eyup/turkiye-simulasyonu-api"
          target="_blank"
          rel="noreferrer"
          className={linkClass}
        >
          sunucu
        </a>
      </p>
    </div>
  );
};
