import React from 'react';

const variants = {
  primary: {
    background: 'linear-gradient(135deg, var(--oracle-red-light), var(--oracle-red))',
    color: '#fff',
    border: 'none',
    boxShadow: '0 2px 8px var(--oracle-red-glow)',
  },
  secondary: {
    background: 'var(--color-surface-2)',
    color: 'var(--color-text-primary)',
    border: '1px solid var(--color-border)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--color-text-secondary)',
    border: '1px solid var(--color-border)',
  },
  success: {
    background: 'linear-gradient(135deg, #2ea043, #3fb950)',
    color: '#fff',
    border: 'none',
  },
  danger: {
    background: 'linear-gradient(135deg, #d73a49, #f85149)',
    color: '#fff',
    border: 'none',
  },
};

const sizes = {
  sm:  { padding: '6px 14px', fontSize: 'var(--text-sm)', borderRadius: 'var(--radius-sm)' },
  md:  { padding: '10px 20px', fontSize: 'var(--text-base)', borderRadius: 'var(--radius-md)' },
  lg:  { padding: '14px 28px', fontSize: 'var(--text-lg)', borderRadius: 'var(--radius-md)' },
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  fullWidth = false,
  icon = null,
  style = {},
  ...props
}) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 200ms ease',
    width: fullWidth ? '100%' : 'auto',
    whiteSpace: 'nowrap',
    letterSpacing: '0.01em',
    ...variants[variant],
    ...sizes[size],
    ...style,
  };

  function handleMouseEnter(e) {
    if (!disabled) {
      e.currentTarget.style.transform = 'translateY(-1px)';
      e.currentTarget.style.filter = 'brightness(1.1)';
    }
  }
  function handleMouseLeave(e) {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.filter = 'brightness(1)';
  }

  return (
    <button
      style={base}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
      {...props}
    >
      {icon && <span style={{ fontSize: '1.1em' }}>{icon}</span>}
      {children}
    </button>
  );
}
