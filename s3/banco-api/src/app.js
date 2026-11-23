import express from 'express';
import clientesRouter from './routes/clientes.js';
import contaRouter from './routes/contas.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import cors from 'cors';                      // ← novo
import { contaService } from './services/contaService.js';
// ...demais imports iguais

const app = express();

// --- Middleware global (antes das rotas) ---
app.use(cors({                                // ← novo
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
}));
app.use(express.json());
app.use(logger);
// ...o resto do arquivo não muda

// --- Health check ---
app.get('/', (req, res) => {
  res.json({ api: 'Banco API', versao: '1.0.0', rotas: ['/clientes'] });
});

// --- Rotas ---
app.use('/clientes', clientesRouter);
app.use('/contas', contaRouter)

// --- 404 para rotas que não existem ---
app.use((req, res) => {
  res.status(404).json({ erro: `Rota ${req.method} ${req.url} não existe` });
});

// --- Tratador de erro: SEMPRE o último ---
app.use(errorHandler);

export default app;