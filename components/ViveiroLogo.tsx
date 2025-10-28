// Logo oficial de Viveiro - Puente de 5 arcos simplificado
export default function ViveiroLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Puente de 5 arcos - Elemento más icónico del escudo */}
      <g>
        {/* Agua (ondas en la parte inferior) */}
        <path
          d="M 5 75 Q 15 70 25 75 T 45 75 T 65 75 T 85 75 T 105 75 L 105 95 L 5 95 Z"
          opacity="0.3"
        />
        <path
          d="M 5 80 Q 15 75 25 80 T 45 80 T 65 80 T 85 80 T 105 80 L 105 95 L 5 95 Z"
          opacity="0.5"
        />

        {/* Base del puente */}
        <rect x="10" y="65" width="80" height="3" />

        {/* 5 Arcos del puente */}
        {/* Arco 1 */}
        <path
          d="M 12 65 Q 12 50 18 50 Q 24 50 24 65"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />

        {/* Arco 2 */}
        <path
          d="M 26 65 Q 26 48 34 48 Q 42 48 42 65"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />

        {/* Arco 3 (central, más grande) */}
        <path
          d="M 44 65 Q 44 45 50 45 Q 56 45 56 65"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        />

        {/* Arco 4 */}
        <path
          d="M 58 65 Q 58 48 66 48 Q 74 48 74 65"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />

        {/* Arco 5 */}
        <path
          d="M 76 65 Q 76 50 82 50 Q 88 50 88 65"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />

        {/* Pilares entre arcos */}
        <rect x="23" y="50" width="3" height="15" />
        <rect x="41" y="48" width="3" height="17" />
        <rect x="56" y="45" width="3" height="20" />
        <rect x="74" y="48" width="3" height="17" />
      </g>

      {/* Corona real simplificada en la parte superior */}
      <g transform="translate(50, 15)">
        {/* Base de la corona */}
        <ellipse cx="0" cy="0" rx="20" ry="3" opacity="0.7" />

        {/* Puntas de la corona (5 puntas) */}
        <path d="M -15 0 L -13 -8 L -11 0" />
        <path d="M -7 0 L -5 -10 L -3 0" />
        <path d="M 0 0 L 0 -12 L 0 0" />
        <path d="M 3 0 L 5 -10 L 7 0" />
        <path d="M 11 0 L 13 -8 L 15 0" />

        {/* Cruz en la cima */}
        <rect x="-1" y="-16" width="2" height="5" opacity="0.8" />
        <rect x="-3" y="-14" width="6" height="1.5" opacity="0.8" />
      </g>
    </svg>
  );
}
