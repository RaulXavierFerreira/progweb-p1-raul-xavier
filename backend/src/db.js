import { DatabaseSync } from 'node:sqlite';

// O banco inteiro é um arquivo. Se não existir, o SQLite cria.
const arquivo = process.env.DB_FILE ?? 'academia.db';
export const db = new DatabaseSync(arquivo);

// No SQLite a checagem de chave estrangeira vem desligada.
// Tem de ligar a cada conexão.
db.exec('PRAGMA foreign_keys = ON;');

// O schema. IF NOT EXISTS: este arquivo roda toda vez que o servidor sobe.
db.exec(`
  CREATE TABLE IF NOT EXISTS alunos (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    nome  TEXT NOT NULL,
    cpf   TEXT NOT NULL UNIQUE,
    email TEXT
  );

  CREATE TABLE IF NOT EXISTS matriculas (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    aluno_id  INTEGER NOT NULL REFERENCES alunos(id),
    plano     TEXT NOT NULL CHECK (plano IN ('MENSAL', 'TRIMESTRAL', 'ANUAL')),
    valor     REAL NOT NULL CHECK (valor > 0),
    status    TEXT NOT NULL DEFAULT 'ATIVA' CHECK (status IN ('ATIVA', 'CANCELADA', 'VENCIDA')),
    criada_em TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// Dados de exemplo: só entram se o banco estiver vazio.
// No Render grátis o arquivo some a cada reinício; assim a demo nunca abre vazia.
const { total } = db.prepare('SELECT COUNT(*) AS total FROM alunos').get();
if (total === 0) {
  const insereAluno = db.prepare(
    'INSERT INTO alunos (nome, cpf, email) VALUES (?, ?, ?)'
  );
  const insereMatricula = db.prepare(
    'INSERT INTO matriculas (aluno_id, plano, valor, status, criada_em) VALUES (?, ?, ?, ?, ?)'
  );

  const agora = new Date().toISOString();

  const ana = insereAluno.run('Ana Silva', '11122233344', 'ana@exemplo.com');
  insereMatricula.run(ana.lastInsertRowid, 'MENSAL', 150, 'ATIVA', agora);

  const bruno = insereAluno.run('Bruno Costa', '22233344455', 'bruno@exemplo.com');
  insereMatricula.run(bruno.lastInsertRowid, 'TRIMESTRAL', 400, 'ATIVA', agora);

  const carla = insereAluno.run('Carla Souza', '33344455566', 'carla@exemplo.com');
  insereMatricula.run(carla.lastInsertRowid, 'ANUAL', 1200, 'VENCIDA', agora);
}
