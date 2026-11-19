import { alunoModel } from '../models/alunoModel.js';
import { erro } from '../utils/erro.js';

export const alunoService = {
  listar() {
    return alunoModel.listar();
  },

  buscarPorId(id) {
    const Aluno = alunoModel.buscarPorId(id);
    if (!Aluno) throw erro(404, 'Aluno não encontrado');
    return Aluno;
  },

  criar({ nome, cpf, email } = {}) {
    // Regra 1: nome e cpf são obrigatórios
    if (!nome || !cpf) throw erro(400, 'Campos "nome" e "cpf" são obrigatórios');
    // Regra 2: cpf é único
    if (alunoModel.existeCpf(cpf)) throw erro(409, 'Já existe um Aluno com este CPF');
    return alunoModel.inserir({ nome, cpf, email });
  },

  atualizar(id, dados = {}) {
    const atualizado = alunoModel.atualizar(id, dados);
    if (!atualizado) throw erro(404, 'Aluno não encontrado');
    return atualizado;
  },

  remover(id) {
    const removido = alunoModel.remover(id);
    if (!removido) throw erro(404, 'Aluno não encontrado');
  },
};