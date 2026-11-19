import { Router } from 'express';
import { matriculaController } from '../controllers/matriculaController.js';
import { erro } from '../utils/erro.js';

const router = Router();

router.get('/', matriculaController.listar);
router.get('/:id', matriculaController.buscar);
router.post('/', matriculaController.criar);
router.put('/:id', matriculaController.atualizar);
router.delete('/:id', matriculaController.remover);

export default router;