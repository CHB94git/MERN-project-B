import { Router } from 'express'

import {
    autenticar,
    comprobarToken,
    confirmar,
    nuevoPassword,
    olvidePassword,
    perfil,
    registrar,
    updatePassword,
    updateProfile
} from '../controllers/veterinarioController.js'

import checkAuth from '../middleware/authMiddleware.js'


const router = Router()

// Rutas públicas
router.post('/', registrar)
router.get('/confirmar/:token', confirmar)
router.post('/login', autenticar)
router.post('/olvide-password', olvidePassword)

// Agrupar rutas iguales con diferente método HTTP
router.route('/olvide-password/:token')
    .get(comprobarToken)
    .post(nuevoPassword)

// Rutas protegidas (autentication required)
router.get('/perfil', checkAuth, perfil)
router.put('/perfil/:id', checkAuth, updateProfile)
router.put('/update-password', checkAuth, updatePassword)

export default router