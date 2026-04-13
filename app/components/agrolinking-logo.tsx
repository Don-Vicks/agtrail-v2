import '../../public/logo.png'

interface AgrolinkingLogoProps {
  className?: string
}

/**
 * Agrolinking wordmark logo with the network globe icon.
 * Renders "agr[icon]linking" in the brand dark-green color.
 */
export function AgrolinkingLogo({ className = '' }: AgrolinkingLogoProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {/* 
      <svg
        viewBox="0 0 290 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
        aria-label="Agrolinking"
      >
        <g transform="translate(85, 6)">
          <circle cx="22" cy="22" r="21" fill="#555" />
          <circle cx="22" cy="22" r="18" fill="#666" />
          <circle cx="22" cy="22" r="2.5" fill="white" />
          <circle cx="22" cy="9" r="2" fill="white" />
          <circle cx="22" cy="35" r="2" fill="white" />
          <circle cx="11" cy="16" r="2" fill="white" />
          <circle cx="33" cy="16" r="2" fill="white" />
          <circle cx="13" cy="31" r="2" fill="white" />
          <circle cx="31" cy="31" r="2" fill="white" />
          <line x1="22" y1="22" x2="22" y2="9" stroke="white" strokeWidth="1" />
          <line x1="22" y1="22" x2="22" y2="35" stroke="white" strokeWidth="1" />
          <line x1="22" y1="22" x2="11" y2="16" stroke="white" strokeWidth="1" />
          <line x1="22" y1="22" x2="33" y2="16" stroke="white" strokeWidth="1" />
          <line x1="22" y1="22" x2="13" y2="31" stroke="white" strokeWidth="1" />
          <line x1="22" y1="22" x2="31" y2="31" stroke="white" strokeWidth="1" />
          <line x1="22" y1="9" x2="33" y2="16" stroke="white" strokeWidth="0.8" />
          <line x1="33" y1="16" x2="31" y2="31" stroke="white" strokeWidth="0.8" />
          <line x1="31" y1="31" x2="22" y2="35" stroke="white" strokeWidth="0.8" />
          <line x1="22" y1="35" x2="13" y2="31" stroke="white" strokeWidth="0.8" />
          <line x1="13" y1="31" x2="11" y2="16" stroke="white" strokeWidth="0.8" />
          <line x1="11" y1="16" x2="22" y2="9" stroke="white" strokeWidth="0.8" />
        </g>

        <text
          x="130"
          y="44"
          fontFamily="'Inter', sans-serif"
          fontSize="46"
          fontWeight="700"
          fill="#264d10"
          letterSpacing="-1"
        >
          linking
        </text>
      </svg>
      */}
      <img 
        src="/logo.png" 
        alt="Agrolinking Logo" 
        className="h-full w-auto object-contain"
      />
    </div>
  )
}
