import { db } from '../db.js';

const COLUNAS = `
  id,
  aluno_id AS alunoId,
  plano,
  valor,
  status,
  criada_em AS criadaEm
`;

export const matriculaModel = {
  listar() {
    return db.prepare(`SELECT ${COLUNAS} FROM matriculas ORDER BY id`).all();
  },

  buscarPorId(id) {
    return db
      .prepare(`SELECT ${COLUNAS} FROM matriculas WHERE id = ?`)
      .get(id) ?? null;
  },

  listarPorAlunoId(alunoId) {
    return db
      .prepare(`SELECT ${COLUNAS} FROM matriculas WHERE aluno_id = ? ORDER BY id`)
      .all(alunoId);
  },

  inserir({ alunoId, plano, valor, status = 'ATIVA', criadaEm }) {
    const insere = db
      .prepare(`INSERT INTO matriculas (aluno_id, plano, valor, status, criada_em)
                VALUES (?, ?, ?, ?, ?)`)
      .run(
        Number(alunoId),
        plano,
        Number(valor),
        status,
        criadaEm ?? new Date().toISOString(),
      );
    return this.buscarPorId(insere.lastInsertRowid);
  },

  atualizar(id, dados) {
    const atual = this.buscarPorId(id);
    if (!atual) return null;
    const novo = { ...atual, ...dados };
    db.prepare(`UPDATE matriculas
                SET aluno_id = ?, plano = ?, valor = ?, status = ?
                WHERE id = ?`)
      .run(Number(novo.alunoId), novo.plano, Number(novo.valor), novo.status, id);
    return this.buscarPorId(id);
  },

  remover(id) {
    const remove = db.prepare('DELETE FROM matriculas WHERE id = ?').run(id);
    return remove.changes > 0;
  },
};