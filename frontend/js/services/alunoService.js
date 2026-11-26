import { api } from '../api.js';

// Regras do lado do front: limpar e validar ANTES de gastar uma requisição.
// O backend valida de novo: nunca confie só no front.
function preparar({ nome, cpf, email }) {
  const dados = {
    nome: (nome ?? '').trim(),
    cpf: (cpf ?? '').replace(/\D/g, ''), // fica só com os dígitos
    email: (email ?? '').trim() || null,
  };
  if (!dados.nome) throw new Error('Informe o nome.');
  if (dados.cpf.length !== 11) throw new Error('O CPF precisa ter 11 dígitos.');
  return dados;
}

export const alunoService = {
  listar() {
    return api.get('/aluno');
  },

  async criar(dados) {
    return api.post('/aluno', preparar(dados));
  },

  async atualizar(id, dados) {
    return api.put(`/aluno/${id}`, preparar(dados));
  },

  remover(id) {
    return api.delete(`/aluno/${id}`);
  },
};