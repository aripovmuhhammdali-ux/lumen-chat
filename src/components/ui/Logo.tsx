export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <rect width="32" height="32" rx="9" className="fill-brand-600" />
      <path d="M16 6.5c1 5.2 3.8 8 9 9-5.2 1-8 3.8-9 9-1-5.2-3.8-8-9-9 5.2-1 8-3.8 9-9Z" fill="#fff" />
    </svg>
  );
}
