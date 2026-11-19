import { matriculaService } from '../services/matriculaService.js';

export const matriculaController = {
  listar(req, res) {
    // Permite filtrar via query string se desejar: GET /matriculas?alunoId=1
    if (req.query.alunoId) {
      const listaPorAluno = matriculaService.listarPorAluno(req.query.alunoId);
      return res.status(200).json(listaPorAluno);
    }

    const lista = matriculaService.listar();
    res.status(200).json(lista);
  },

  buscar(req, res) {
    const matricula = matriculaService.buscarPorId(req.params.id);
    res.status(200).json(matricula);
  },

  criar(req, res) {
    const novaMatricula = matriculaService.cadastrar(req.body);
    res.status(201).json(novaMatricula);
  },

  atualizar(req, res) {
    const matriculaAtualizada = matriculaService.atualizar(req.params.id, req.body);
    res.status(200).json(matriculaAtualizada);
  },

  remover(req, res) {
    matriculaService.remover(req.params.id);
    res.status(204).send();
  },
};