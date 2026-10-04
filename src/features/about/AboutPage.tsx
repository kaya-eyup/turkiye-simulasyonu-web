export const AboutPage = () => {
  return (
    <div className="max-w-prose">
      <h1>Hakkında</h1>
      <p className="mt-4">
        Türkiye Simülasyonu, Türkiye'ye özgü yemekleri, şehirleri, adetleri ve
        absürtlükleri puanlayıp yorumladığın bir geri bildirim ekranı.
        Simülasyonu bitirdin; şimdi deneyimini değerlendirme zamanı.
      </p>
      <p className="mt-4">
        React, TypeScript, TanStack Query ve Tailwind ile yazılmış bir öğrenme
        projesi. ASP.NET Core backend'i yolda.
      </p>
      <p className="mt-4">
        Kaynak kodu:{" "}
        <a
          href="https://github.com/kaya-eyup/turkiye-simulasyonu-web"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4 hover:text-tea"
        >
          GitHub
        </a>
      </p>
    </div>
  );
};
