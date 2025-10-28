// Logo oficial de Viveiro - Puente de 5 arcos simplificado y limpio
export default function ViveiroLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Puente de 5 arcos - Símbolo icónico de Viveiro */}
      <g transform="translate(10, 35)">
        {/* Tablero superior del puente */}
        <rect x="0" y="0" width="100" height="6" rx="1" />

        {/* 5 Arcos - Diseño limpio y claro */}
        {/* Arco 1 */}
        <path
          d="M 8 6 Q 8 25 14 25 Q 20 25 20 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Arco 2 */}
        <path
          d="M 28 6 Q 28 25 34 25 Q 40 25 40 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Arco 3 (central) */}
        <path
          d="M 48 6 Q 48 25 54 25 Q 60 25 60 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Arco 4 */}
        <path
          d="M 68 6 Q 68 25 74 25 Q 80 25 80 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Arco 5 */}
        <path
          d="M 88 6 Q 88 25 94 25 Q 100 25 100 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Pilares del puente */}
        <rect x="19" y="6" width="4" height="19" rx="1" />
        <rect x="39" y="6" width="4" height="19" rx="1" />
        <rect x="59" y="6" width="4" height="19" rx="1" />
        <rect x="79" y="6" width="4" height="19" rx="1" />
      </g>

      {/* Ondas de agua debajo - Río Landro */}
      <g transform="translate(0, 70)">
        <path
          d="M 10 0 Q 20 -3 30 0 T 50 0 T 70 0 T 90 0 T 110 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M 10 8 Q 20 5 30 8 T 50 8 T 70 8 T 90 8 T 110 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.4"
        />
      </g>
    </svg>
  );
}
