/** Our own editor mark (not Microsoft's): a blue tile with "J" and code brackets. */
export function Logo({ size = 16 }: { size?: number }) {
  return (
    <svg
      className="logo"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role="img"
      aria-label="Joenel-Portfolio logo"
    >
      <rect width="32" height="32" rx="7" fill="#0078d4" />
      <path
        d="M9 11 5 16l4 5M23 11l4 5-4 5"
        fill="none"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 9v10a4 4 0 0 1-7 2.6"
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  )
}
