import { DatabaseSync } from 'node:sqlite';

// O banco inteiro é um arquivo. Se não existir, o SQLite cria.
const arquivo = process.env.DB_FILE ?? 'banco.db';
export const db = new DatabaseSync(arquivo);

// No SQLite a checagem de chave estrangeira vem desligada.
// Tem de ligar a cada conexão.
db.exec('PRAGMA foreign_keys = ON;');

// O schema. IF NOT EXISTS: este arquivo roda toda vez que o servidor sobe.
db.exec(`
  CREATE TABLE IF NOT EXISTS clientes (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    nome  TEXT NOT NULL,
    cpf   TEXT NOT NULL UNIQUE,
    email TEXT
  );

  CREATE TABLE IF NOT EXISTS contas (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo       TEXT NOT NULL CHECK (tipo IN ('corrente', 'poupanca')),
    saldo      REAL NOT NULL,
    cliente_id INTEGER NOT NULL REFERENCES clientes(id),
    criada_em  TEXT NOT NULL
  );
`);

// Dados de exemplo: só entram se o banco estiver vazio.
// No Render grátis o arquivo some a cada reinício; assim a demo nunca abre vazia.

const { total } = db.prepare('SELECT COUNT(*) AS total FROM clientes').get();
if (total === 0) {
  const insereClientes = db.prepare(
    'INSERT INTO clientes (nome, cpf, email) VALUES (?, ?, ?)'
  );
  const insereContas = db.prepare(
    'INSERT INTO contas (tipo, saldo, cliente_id, criada_em) VALUES (?, ?, ?, ?)'
  );

  const agora = new Date().toISOString();

  const ana = insereClientes.run('Ana Silva', '11122233344', 'ana@exemplo.com');
  insereContas.run('corrente', 1500, ana.lastInsertRowid, agora);

  const bruno = insereClientes.run('Bruno Costa', '22233344455', 'bruno@exemplo.com');
  insereContas.run('corrente', 3000, bruno.lastInsertRowid, agora);

  const carla = insereClientes.run('Carla Souza', '33344455566', 'carla@exemplo.com');
  insereContas.run('poupanca', 20000, carla.lastInsertRowid, agora);
}