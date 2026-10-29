type SectionHeaderProps = {
  id: string; // bölümün aria-labelledby'ı bu id'ye bağlanıyor
  title: string;
  description: string;
};

// Ana sayfadaki bölümlerin ortak başlığı: ortalı, belirgin başlık + açıklama.
// İki bölümde aynı sınıflar tekrarlanınca biri değişip diğeri unutuluyordu.
export function SectionHeader({ id, title, description }: SectionHeaderProps) {
  return (
    <header className="mb-8 text-center">
      <h2 id={id} className="text-3xl sm:text-4xl">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-[60ch] text-base text-muted sm:text-lg">
        {description}
      </p>
    </header>
  );
}
