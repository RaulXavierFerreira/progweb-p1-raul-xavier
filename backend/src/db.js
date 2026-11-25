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