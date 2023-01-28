import { Router } from 'express'

import {
    actualizarPaciente,
    agregarPaciente,
    eliminarPaciente,
    obtenerPaciente,
    obtenerPacientes
} from '../controllers/pacienteController.js'

import checkAuth from '../middleware/authMiddleware.js'

const router = Router()

router
    .route('/')
    .post(checkAuth, agregarPaciente)
    .get(checkAuth, obtenerPacientes)

router
    .route('/:id')
    .get(checkAuth, obtenerPaciente)
    .put(checkAuth, actualizarPaciente)
    .delete(checkAuth, eliminarPaciente)


export default router