import React from 'react';

const Input = ({
  type = 'text', // text, password, email, number, date, time, etc.
  value,
  onChange,
  placeholder,
  disabled = false,
  readOnly = false,
  name,
  id,
  label,
  error, // Mensagem de erro a ser exibida
  className = '',
  inputClassName = '', // Classe específica para o input
  labelClassName = '', // Classe específica para o label
  errorClassName = '', // Classe específica para o erro
  style = {},
  inputStyle = {},
  labelStyle = {},
  errorStyle = {},
  required = false,
  ...props // Outras props como 'min', 'max', 'step', etc.
}) => {

  const baseContainerStyle = {
    marginBottom: '15px', // Espaçamento padrão abaixo do input
    width: '100%', // Ocupa a largura do container pai por padrão
  };

  const baseLabelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: 'var(--dark-blue-text)',
  };

  const baseInputStyle = {
    width: '100%', // O input em si ocupa toda a largura do seu container
    padding: '10px 12px',
    border: '1px solid var(--border-color)', // Cor da borda definida no global.css
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box', // Garante que padding e border não aumentem o tamanho total
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  };

  const baseErrorStyle = {
    color: 'var(--danger-red)',
    fontSize: '0.8rem',
    marginTop: '4px',
  };

  // Estilo para quando o input está focado (simulado aqui, idealmente com CSS :focus)
  // baseInputStyle[':focus'] = {
  // borderColor: 'var(--primary-blue)',
  // boxShadow: '0 0 0 2px rgba(0, 123, 255, 0.25)',
  // };

  if (error) {
    baseInputStyle.borderColor = 'var(--danger-red)';
  }
  if (disabled) {
    baseInputStyle.backgroundColor = '#e9ecef'; // Um cinza claro para desabilitado
    baseInputStyle.cursor = 'not-allowed';
  }


  const combinedContainerStyle = { ...baseContainerStyle, ...style };
  const combinedLabelStyle = { ...baseLabelStyle, ...labelStyle };
  const combinedInputStyle = { ...baseInputStyle, ...inputStyle };
  const combinedErrorStyle = { ...baseErrorStyle, ...errorStyle };


  return (
    <div style={combinedContainerStyle} className={className}>
      {label && (
        <label htmlFor={id || name} style={combinedLabelStyle} className={labelClassName}>
          {label} {required && <span style={{color: 'var(--danger-red)'}}>*</span>}
        </label>
      )}
      <input
        type={type}
        id={id || name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        style={combinedInputStyle}
        className={inputClassName}
        {...props}
      />
      {error && <div style={combinedErrorStyle} className={errorClassName}>{error}</div>}
    </div>
  );
};

export default Input;
