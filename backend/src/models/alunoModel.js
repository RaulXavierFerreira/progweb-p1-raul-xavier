import { db } from '../db.js';

export const alunoModel = {
  listar() {
    return db.prepare('SELECT * FROM alunos ORDER BY id').all();
  },

  buscarPorId(id) {
    return db.prepare('SELECT * FROM alunos WHERE id = ?').get(id) ?? null;
  },

  existeCpf(cpf, ignorarId = null) {
    if(ignorarId != null){
      const linha = db
        .prepare('SELECT 1 FROM alunos WHERE cpf = ? AND id != ?')
        .get(cpf, ignorarId)
      return linha !== undefined
    }
    const linha = db
          .prepare('SELECT 1 FROM alunos WHERE cpf = ?')
          .get(cpf);
        return linha !== undefined;
  },

  inserir({ nome, cpf, email }) {
    const insere = db
          .prepare('INSERT INTO alunos (nome, cpf, email) VALUES (?, ?, ?)')
          .run(nome, cpf, email ?? null);
        return this.buscarPorId(insere.lastInsertRowid);
  },

  atualizar(id, dados) {
    const atual = this.buscarPorId(id);
    if (!atual) return null;
    const novo = { ...atual, ...dados };
    db.prepare('UPDATE alunos SET nome = ?, cpf = ?, email = ? WHERE id = ?')
      .run(novo.nome, novo.cpf, novo.email ?? null, id); // o id nunca muda
    return this.buscarPorId(id);
  },

  remover(id) {
    const remove = db.prepare('DELETE FROM alunos WHERE id = ?').run(id);
    return remove.changes > 0; // true = removeu
  },
};