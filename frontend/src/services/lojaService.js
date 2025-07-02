import { useContext } from 'react'; // Para pegar o apiClient do AuthContext se não for passado
import { AuthContext } from '../contexts/AuthContext'; // Para o tipo, se necessário

// Função para ser usada dentro de componentes que já usam useAuth()
export const getLojasFromApi = async (apiClientInstance) => {
  try {
    // A rota GET /api/colaborador/lojas já foi criada no backend
    // e retorna uma lista de todas as lojas com dados básicos.
    // Admin também tem acesso a essa rota através do middleware isColaboradorOuAdmin.
    // Se quiséssemos uma rota específica de admin com mais dados, seria /api/admin/lojas.
    const response = await apiClientInstance.get('/colaborador/lojas'); // Usando a rota de colaborador
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar lojas no serviço:", error.response?.data?.message || error.message);
    throw error.response?.data || new Error("Erro ao buscar lojas");
  }
};

// Exemplo de como poderia ser um serviço mais completo para CRUD de lojas (para Admin)
/*
const lojaService = (apiClient) => ({
  getAllLojas: async () => {
    const response = await apiClient.get('/admin/lojas'); // Rota de admin para todas as lojas
    return response.data;
  },
  getLojaById: async (id) => {
    const response = await apiClient.get(`/admin/lojas/${id}`);
    return response.data;
  },
  createLoja: async (lojaData) => {
    const response = await apiClient.post('/admin/lojas', lojaData);
    return response.data;
  },
  updateLoja: async (id, lojaData) => {
    const response = await apiClient.put(`/admin/lojas/${id}`, lojaData);
    return response.data;
  },
  deleteLoja: async (id) => {
    const response = await apiClient.delete(`/admin/lojas/${id}`);
    return response.data; // Ou apenas status
  },
});

export default lojaService;
*/
