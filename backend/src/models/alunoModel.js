let aluno = [];
let proximoId = 1;

export const alunoModel = {
  listar() {
    return aluno;
  },

  buscarPorId(id) {
    return aluno.find((c) => c.id === id) ?? null;
  },

  existeCpf(cpf) {
    return aluno.some((c) => c.cpf === cpf);
  },

  inserir({ nome, cpf, email }) {
    const novo = { id: proximoId++, nome, cpf, email: email ?? null };
    aluno.push(novo);
    return novo;
  },

  atualizar(id, dados) {
    const i = aluno.findIndex((c) => c.id === id);
    if (i === -1) return null;
    aluno[i] = { ...aluno[i], ...dados, id }; // o id nunca muda
    return aluno[i];
  },

  remover(id) {
    const antes = aluno.length;
    aluno = aluno.filter((c) => c.id !== id);
    return aluno.length < antes; // true = removeu
  },
};