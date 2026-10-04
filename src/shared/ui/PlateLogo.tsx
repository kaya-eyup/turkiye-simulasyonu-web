// Türk plakası biçiminde logo. Gerçek plakalar gibi temadan bağımsız: hep beyaz zemin, siyah yazı.
export function PlateLogo() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-9 items-stretch overflow-hidden rounded-[5px] border-2 border-black bg-white font-condensed text-black"
    >
      <span className="flex w-6 items-end justify-center bg-plate pb-1 text-[10px] leading-none font-semibold text-white">
        TR
      </span>
      <span className="flex items-center px-2.5 text-xl font-bold tracking-wide">
        06 SIM 26
      </span>
    </span>
  );
}
