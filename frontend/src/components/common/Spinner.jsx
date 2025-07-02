import React from 'react';

// Estilos podem ser movidos para um arquivo CSS/module.css se ficarem complexos
const spinnerStyle = {
  border: '4px solid rgba(0, 0, 0, 0.1)',
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  borderLeftColor: 'var(--primary-blue)', // Usando a cor primária da paleta
  animation: 'spin 1s ease infinite',
  margin: '20px auto', // Centraliza o spinner se usado sozinho
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px',
};

const Spinner = ({ size = 'medium', fullPage = false }) => {
  let sSize = '36px';
  if (size === 'small') sSize = '20px';
  if (size === 'large') sSize = '60px';

  const dynamicSpinnerStyle = {
    ...spinnerStyle,
    width: sSize,
    height: sSize,
  };

  if (fullPage) {
    return (
      <div style={{ ...containerStyle, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255,255,255,0.8)', zIndex: 9999 }}>
        <style>
          {`
            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
          `}
        </style>
        <div style={dynamicSpinnerStyle}></div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
       <style>
        {`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
      <div style={dynamicSpinnerStyle}></div>
    </div>
  );
};

export default Spinner;
