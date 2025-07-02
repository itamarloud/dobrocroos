import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Button from './Button'; // Usaremos nosso componente Button

const Modal = ({
  isOpen,
  onClose,
  title,
  children, // Conteúdo do modal
  footer, // Elementos para o rodapé (ex: botões de Salvar, Cancelar)
  size = 'medium', // 'small', 'medium', 'large'
  className = '',
  closeOnOverlayClick = true,
}) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) { // ESC key
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // Impede scroll da página ao fundo
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  let modalWidth = '500px';
  if (size === 'small') modalWidth = '300px';
  if (size === 'large') modalWidth = '800px';
  if (size === 'xlarge') modalWidth = '90%';


  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000, // Garante que o modal fique sobre outros elementos
    padding: '20px', // Espaço para o modal não colar nas bordas em telas pequenas
  };

  const modalStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    width: modalWidth,
    maxWidth: '100%', // Garante responsividade
    maxHeight: '90vh', // Altura máxima, permitindo scroll interno
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden', // Para o scroll interno funcionar corretamente
  };

  const headerStyle = {
    padding: '15px 20px',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const titleStyle = {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: '600',
    color: 'var(--dark-blue-text)',
  };

  const bodyStyle = {
    padding: '20px',
    overflowY: 'auto', // Permite scroll se o conteúdo for maior que o modal
    flexGrow: 1,
  };

  const footerStyle = {
    padding: '15px 20px',
    borderTop: '1px solid var(--border-color)',
    display: 'flex',
    justifyContent: 'flex-end', // Alinha botões à direita por padrão
    gap: '10px', // Espaço entre os botões do rodapé
    backgroundColor: '#f9fafb',
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#aaa',
    padding: '0 5px',
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div style={overlayStyle} onClick={handleOverlayClick} className={`modal-overlay ${className}-overlay`}>
      <div style={modalStyle} className={`modal-content ${className}-content`}>
        <div style={headerStyle} className="modal-header">
          {title && <h3 style={titleStyle} className="modal-title">{title}</h3>}
          <button onClick={onClose} style={closeButtonStyle} aria-label="Fechar modal">&times;</button>
        </div>
        <div style={bodyStyle} className="modal-body">
          {children}
        </div>
        {footer && (
          <div style={footerStyle} className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.getElementById('root') // Ou um elemento portal específico se preferir
  );
};

export default Modal;
