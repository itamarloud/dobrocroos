import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getLojasFromApi } from '../services/lojaService'; // Usando a função específica
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';
// import Button from '../components/common/Button'; // Para futuras ações de admin

const LojasPage = () => {
  const { apiClient, user } = useAuth(); // Pegamos o apiClient configurado do AuthContext
  const [lojas, setLojas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLojas = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getLojasFromApi(apiClient); // Passa o apiClient
        setLojas(data.lojas || data); // A API pode retornar {lojas: []} ou diretamente []
      } catch (err) {
        setError(err.message || 'Falha ao carregar lojas.');
        console.error("Erro em fetchLojas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLojas();
  }, [apiClient]);

  const pageStyle = {
    padding: '20px',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', // Grid responsivo
    gap: '20px',
  };

  const errorStyle = {
      color: 'var(--danger-red)',
      textAlign: 'center',
      padding: '20px',
      border: '1px solid var(--danger-red)',
      backgroundColor: '#ffebee',
      borderRadius: '4px',
  }

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div style={pageStyle}><p style={errorStyle}>Erro: {error}</p></div>;
  }

  return (
    <div style={pageStyle}>
      <h2 style={{ color: 'var(--dark-blue-text)', marginBottom: '20px' }}>Nossas Lojas</h2>

      {/* Futuramente, botão para Admin adicionar nova loja */}
      {/* {user?.tipo_usuario === 'administrador' && (
        <div style={{ marginBottom: '20px' }}>
          <Button variant="primary">Adicionar Nova Loja</Button>
        </div>
      )} */}

      {lojas.length === 0 && !loading && (
        <p>Nenhuma loja encontrada.</p>
      )}

      {lojas.length > 0 && (
        <div style={gridStyle}>
          {lojas.map((loja) => (
            <Card key={loja.id} title={loja.nome}>
              <p><strong>Cidade:</strong> {loja.cidade || 'N/A'}{loja.estado ? `, ${loja.estado}` : ''}</p>
              {/* <p><strong>Endereço:</strong> {loja.endereco || 'N/A'}</p> */}
              <p><strong>Telefone:</strong> {loja.telefone || 'N/A'}</p>
              <p><strong>Horário:</strong> {loja.horario_funcionamento || 'N/A'}</p>
              {/* Adicionar mais detalhes ou ações se necessário */}
              {/* {user?.tipo_usuario === 'administrador' && (
                // Exemplo de ações para admin no card
                // <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                //   <Button size="small">Editar</Button>
                //   <Button size="small" variant="danger">Excluir</Button>
                // </div>
              )} */}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LojasPage;
