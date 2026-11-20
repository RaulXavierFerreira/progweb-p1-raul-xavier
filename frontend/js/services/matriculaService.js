import { api } from '../api.js';

function preparar({ alunoId, plano, valor, status }) {
  const dados = {
    alunoId: Number(alunoId),
    plano: (plano ?? '').trim(),
    valor: Number(valor),
    status: (status ?? 'ATIVA').trim(),
  };

  if (!dados.alunoId) throw new Error('Selecione um aluno.');
  if (!dados.plano) throw new Error('Informe o plano.');
  if (!Number.isFinite(dados.valor) || dados.valor <= 0) {
    throw new Error('O valor deve ser maior que zero.');
  }

  return dados;
}

export const matriculaService = {
  listar() {
    return api.get('/matriculas');
  },

  async criar(dados) {
    return api.post('/matriculas', preparar(dados));
  },

  async atualizar(id, dados) {
    return api.put(`/matriculas/${id}`, preparar(dados));
  },

  remover(id) {
    return api.delete(`/matriculas/${id}`);
  },
};