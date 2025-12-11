import React, { useRef, useEffect, useState } from 'react';

const LogoLoop = ({
  logos,
  speed = 100,
  direction = 'left',
  logoHeight = 48,
  gap = 40,
  hoverSpeed = 0,
  scaleOnHover = false,
  fadeOut = false,
  fadeOutColor = '#ffffff',
  ariaLabel = 'Logo carousel',
}) => {
  const containerRef = useRef(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      const width = containerRef.current.scrollWidth;
      setContentWidth(width);
    }
  }, [logos]);

  const animationStyle = {
    display: 'flex',
    gap: `${gap}px`,
    animation: `scroll-${direction} ${contentWidth / speed}s linear infinite`,
    animationPlayState: isHovered && hoverSpeed === 0 ? 'paused' : 'running',
    width: 'max-content',
  };

  const keyframes = `
    @keyframes scroll-left {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    @keyframes scroll-right {
      0% { transform: translateX(-50%); }
      100% { transform: translateX(0); }
    }
  `;

  return (
    <div
      style={{
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
        maskImage: fadeOut ? `linear-gradient(to right, transparent, black 10%, black 90%, transparent)` : 'none',
        WebkitMaskImage: fadeOut ? `linear-gradient(to right, transparent, black 10%, black 90%, transparent)` : 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={ariaLabel}
    >
      <style>{keyframes}</style>
      <div ref={containerRef} style={animationStyle}>
        {[...logos, ...logos].map((logo, index) => (
          <a
            key={index}
            href={logo.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              height: `${logoHeight}px`,
              display: 'flex',
              alignItems: 'center',
              transition: 'transform 0.3s',
              transform: isHovered && scaleOnHover ? 'scale(1.1)' : 'scale(1)',
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            {logo.node ? (
              <span style={{ fontSize: `${logoHeight}px` }}>{logo.node}</span>
            ) : (
              <img src={logo.src} alt={logo.alt} style={{ height: '100%', width: 'auto' }} />
            )}
          </a>
        ))}
      </div>
    </div>
  );
};

export default LogoLoop;