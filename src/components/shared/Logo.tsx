/**
 * Logo — uses the actual favicon.svg bolt icon + wordmark.
 * Pass `size` to control the icon height (default 22px).
 * Pass `textSize` to control font-size of the wordmark.
 */

interface LogoProps {
  size?: number;
  textSize?: string;
  textColor?: string;
  hideText?: boolean;
}

const Logo = ({ size = 22, textSize = '15px', textColor, hideText = false }: LogoProps) => {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '7px',
        textDecoration: 'none',
        flexShrink: 0,
      }}
    >
      {/* Inline SVG so it always loads regardless of public path */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={Math.round(size * (46 / 48))}
        viewBox="0 0 48 46"
        fill="none"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <path
          fill="#863bff"
          d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z"
        />
        {/* Highlight shimmer (simplified from the full SVG) */}
        <path
          fill="rgba(255,255,255,0.25)"
          d="M38.047 1.788c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h6.1c.943 0 1.473 1.088.89 1.832L25.947 44.94c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-.573-1.536L38.047 1.788z"
        />
      </svg>

      {!hideText && (
        <span
          className={textColor ? '' : 'text-zinc-900 dark:text-white'}
          style={{
            fontSize: textSize,
            fontWeight: 700,
            letterSpacing: '-0.04em',
            lineHeight: 1,
            ...(textColor ? { color: textColor } : {}),
          }}
        >
          KanbanBoard
        </span>
      )}
    </span>
  );
};

export default Logo;
