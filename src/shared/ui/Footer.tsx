export function Footer() {
  return (
    <footer className="border-t border-line">
      <p className="mx-auto max-w-5xl px-4 py-6 text-center text-sm text-muted">
        © {new Date().getFullYear()} Türkiye Simülasyonu
      </p>
    </footer>
  );
}
