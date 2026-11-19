import { alunoService } from '../services/alunoService.js';

export const alunoController = {
  listar(req, res) {
    res.json(alunoService.listar());
  },

  buscarPorId(req, res) {
    res.json(alunoService.buscarPorId(Number(req.params.id)));
  },

  criar(req, res) {
    const novo = alunoService.criar(req.body);
    res.status(201).json(novo);
  },

  atualizar(req, res) {
    res.json(alunoService.atualizar(Number(req.params.id), req.body));
  },

  remover(req, res) {
    alunoService.remover(Number(req.params.id));
    res.status(204).end();
  },
};