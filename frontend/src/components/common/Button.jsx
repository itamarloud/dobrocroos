import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button', // 'button', 'submit', 'reset'
  variant = 'primary', // 'primary', 'secondary', 'danger', 'link'
  disabled = false,
  size = 'medium', // 'small', 'medium', 'large'
  className = '', // Permite classes CSS customizadas
  style = {},     // Permite estilos inline customizados
  ...props // Outras props como 'title', 'aria-label', etc.
}) => {

  // Base styles
  const baseStyle = {
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none', // Para variantes de link
    transition: 'background-color 0.2s ease, opacity 0.2s ease',
  };

  // Size styles
  let sizeStyle = {};
  switch (size) {
    case 'small':
      sizeStyle = { padding: '6px 12px', fontSize: '0.875rem' };
      break;
    case 'large':
      sizeStyle = { padding: '12px 24px', fontSize: '1.125rem' };
      break;
    default: // medium
      sizeStyle = { padding: '10px 20px', fontSize: '1rem' };
      break;
  }

  // Variant styles
  let variantStyle = {};
  switch (variant) {
    case 'secondary':
      variantStyle = {
        backgroundColor: 'var(--neutral-blue-gray)', // Cinza azulado
        color: 'white',
        border: '1px solid var(--neutral-blue-gray)',
      };
      break;
    case 'danger':
      variantStyle = {
        backgroundColor: 'var(--danger-red)', // Vermelho
        color: 'white',
      };
      break;
    case 'link':
      variantStyle = {
        backgroundColor: 'transparent',
        color: 'var(--primary-blue)',
        padding: '0', // Links geralmente não têm padding
        textDecoration: 'underline',
      };
      break;
    default: // primary
      variantStyle = {
        backgroundColor: 'var(--primary-blue)', // Azul primário
        color: 'white',
      };
      break;
  }

  const disabledStyle = disabled ? { opacity: 0.6, cursor: 'not-allowed' } : {};

  const combinedStyles = {
    ...baseStyle,
    ...sizeStyle,
    ...variantStyle,
    ...disabledStyle,
    ...style, // Permite sobrescrever com estilos inline
  };

  // Hover effect (não pode ser feito com estilos inline diretamente para pseudo-classes)
  // Para hover, idealmente usaríamos classes CSS ou styled-components.
  // Por simplicidade, não adicionarei hover complexo aqui, mas é uma consideração.
  // Exemplo de como seria com CSS: .button-primary:hover { background-color: var(--secondary-blue); }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={combinedStyles}
      className={`btn btn-${variant} ${className}`} // Adiciona classes para estilização externa se necessário
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
