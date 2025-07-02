import React from 'react';

const Card = ({
  children,
  title,
  className = '',
  style = {},
  titleClassName = '',
  titleStyle = {},
  bodyClassName = '',
  bodyStyle = {},
  actions, // Pode ser um JSX para botões ou links no rodapé do card
  actionsClassName = '',
  actionsStyle = {}
}) => {

  const baseCardStyle = {
    backgroundColor: 'var(--background-light)', // Branco
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    overflow: 'hidden', // Para garantir que o borderRadius seja respeitado por imagens, etc.
    marginBottom: '20px', // Espaçamento padrão abaixo do card
    display: 'flex',
    flexDirection: 'column', // Para organizar title, body e actions
  };

  const baseTitleStyle = {
    padding: '15px 20px',
    borderBottom: '1px solid var(--border-color)',
    fontSize: '1.2rem',
    fontWeight: '600',
    color: 'var(--dark-blue-text)',
    margin: 0, // Reset margin padrão do h*
  };

  const baseBodyStyle = {
    padding: '20px',
    flexGrow: 1, // Faz o corpo do card crescer se houver espaço
  };

  const baseActionsStyle = {
    padding: '15px 20px',
    borderTop: '1px solid var(--border-color)',
    backgroundColor: '#f9fafb', // Um fundo levemente diferente para a área de ações
  };

  const combinedCardStyle = { ...baseCardStyle, ...style };
  const combinedTitleStyle = { ...baseTitleStyle, ...titleStyle };
  const combinedBodyStyle = { ...baseBodyStyle, ...bodyStyle };
  const combinedActionsStyle = { ...baseActionsStyle, ...actionsStyle };


  return (
    <div style={combinedCardStyle} className={`card ${className}`}>
      {title && (
        <h3 style={combinedTitleStyle} className={`card-title ${titleClassName}`}>
          {title}
        </h3>
      )}
      <div style={combinedBodyStyle} className={`card-body ${bodyClassName}`}>
        {children}
      </div>
      {actions && (
        <div style={combinedActionsStyle} className={`card-actions ${actionsClassName}`}>
          {actions}
        </div>
      )}
    </div>
  );
};

export default Card;
