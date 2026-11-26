import express from 'express';
import cors from 'cors'; 
import alunoRouter from './routes/aluno.js';
import matriculaRouter from './routes/matricula.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// --- Middleware global (antes das rotas) ---
const origensPermitidas = [
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'https://progweb-p1-raul-xavier-frontend.vercel.app',
  process.env.CORS_ORIGIN,
].filter(Boolean);

app.use(cors({
  origin: origensPermitidas,
}));

// --- Health check ---
app.get('/', (req, res) => {
  res.json({ api: 'Backend', versao: '1.0.0', rotas: ['/aluno', '/matricula'] }); 
});

// --- Rotas ---
app.use('/aluno', alunoRouter);
app.use('/matriculas', matriculaRouter);

// --- 404 para rotas que não existem ---
app.use((req, res) => {
  res.status(404).json({ erro: `Rota ${req.method} ${req.url} não existe` });
});

// --- Tratador de erro: SEMPRE o último ---
app.use(errorHandler);

export default app;