let matriculas = [];
let proximoId = 1;

export const matriculaModel = {
  listar() {
    return matriculas;
  },

  buscarPorId(id) {
    return matriculas.find((m) => m.id === id) ?? null;
  },

  listarPorAlunoId(alunoId) {
    return matriculas.filter((m) => m.alunoId === alunoId);
  },

  inserir({ alunoId, plano, valor, status }) {
    const nova = {
      id: proximoId++,
      alunoId,
      plano,
      valor,
      status: status ?? 'ATIVA',
    };
    matriculas.push(nova);
    return nova;
  },

  atualizar(id, dados) {
    const i = matriculas.findIndex((m) => m.id === id);
    if (i === -1) return null;
    matriculas[i] = { ...matriculas[i], ...dados, id }; // o id nunca muda
    return matriculas[i];
  },

  remover(id) {
    const antes = matriculas.length;
    matriculas = matriculas.filter((m) => m.id !== id);
    return matriculas.length < antes; // true = removeu
  },
};