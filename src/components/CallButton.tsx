export function CallButton({
  phoneNumber,
  label = "Pozovi",
}: {
  phoneNumber: string;
  label?: string;
}) {
  const clean = phoneNumber.replace(/[^\d+]/g, "");
  const digits = phoneNumber.replace(/\D/g, "");
  const display =
    digits.length === 10
      ? `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
      : phoneNumber;
  return (
    <a
      href={`tel:${clean}`}
      aria-label={`Pozovi ${phoneNumber}`}
      className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-sky-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/40 print:hidden"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.86.31 1.7.57 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.09a2 2 0 0 1 2.11-.45c.8.26 1.64.45 2.5.57A2 2 0 0 1 22 16.92z" />
      </svg>
      <span className="hidden sm:inline">{label}</span>
      <span className="tabular-nums">{display}</span>
    </a>
  );
}
