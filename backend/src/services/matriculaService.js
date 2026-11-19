import { matriculaModel } from '../models/matriculaModel.js';
import { alunoModel } from '../models/alunoModel.js';
import { erro } from '../utils/erro.js';

const STATUS_VALIDOS = ['ATIVA', 'CANCELADA', 'VENCIDA'];

export const matriculaService = {
  listar() {
    return matriculaModel.listar();
  },

  buscarPorId(id) {
    const matricula = matriculaModel.buscarPorId(Number(id));
    if (!matricula) {
      throw erro(404, 'Matrícula não encontrada.');
    }
    return matricula;
  },

  listarPorAluno(alunoId) {
    const aluno = alunoModel.buscarPorId(Number(alunoId));
    if (!aluno) {
      throw erro(404, 'Aluno não encontrado.');
    }
    return matriculaModel.listarPorAlunoId(Number(alunoId));
  },

  cadastrar({ alunoId, plano, valor, status = 'ATIVA' }) {
    // 1. Validação de campos obrigatórios (400 Bad Request)
    if (!alunoId || !plano || valor === undefined) {
      throw erro(400, 'alunoId, plano e valor são obrigatórios.');
    }

    // 2. Regra de dependência do Pai (422 Unprocessable Entity)
    const alunoExiste = alunoModel.buscarPorId(Number(alunoId));
    if (!alunoExiste) {
      throw erro(422, 'Não é possível matricular: alunoId informado não existe.');
    }

    // 3. Regra de valor válido (400 Bad Request)
    if (typeof valor !== 'number' || valor <= 0) {
      throw erro(400, 'O valor da matrícula deve ser maior que zero.');
    }

    // 4. Regra de status dentro da lista permitida (400 Bad Request)
    if (!STATUS_VALIDOS.includes(status)) {
      throw erro(400, `Status inválido. Valores aceitos: ${STATUS_VALIDOS.join(', ')}.`);
    }

    return matriculaModel.inserir({
      alunoId: Number(alunoId),
      plano,
      valor,
      status,
    });
  },

  atualizar(id, dados) {
    const matriculaAtual = this.buscarPorId(id);

    if (dados.valor !== undefined && (typeof dados.valor !== 'number' || dados.valor <= 0)) {
      throw erro(400, 'O valor da matrícula deve ser maior que zero.');
    }

    if (dados.status !== undefined && !STATUS_VALIDOS.includes(dados.status)) {
      throw erro(400, `Status inválido. Valores aceitos: ${STATUS_VALIDOS.join(', ')}.`);
    }

    if (dados.alunoId !== undefined) {
      const alunoExiste = alunoModel.buscarPorId(Number(dados.alunoId));
      if (!alunoExiste) {
        throw erro(422, 'Não é possível atualizar: alunoId informado não existe.');
      }
      dados.alunoId = Number(dados.alunoId);
    }

    return matriculaModel.atualizar(matriculaAtual.id, dados);
  },

  remover(id) {
    const removeu = matriculaModel.remover(Number(id));
    if (!removeu) {
      throw erro(404, 'Matrícula não encontrada.');
    }
  },
};