import Veterinario from "../models/Veterinario.js";

import {
    emailOlvidePassword,
    emailRegistro,
    generarID,
    generarJWT
} from '../helpers/index.js'

const registrar = async (req, res) => {
    const { email, nombre } = req.body;

    // Prevenir usuarios duplicados
    const existeUsuario = await Veterinario.findOne({ email })

    if (existeUsuario) {
        const error = new Error('Email de usuario ya registrado!')
        return res.status(400).json({ msg: error.message })
    }

    try {
        // Guardar nuevo veterinario
        const veterinario = new Veterinario(req.body)
        const veterinarioGuardado = await veterinario.save()

        // Enviar el email
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        })

        res.json(veterinarioGuardado)
    } catch (error) {
        console.log(error)
    }
}


const perfil = (req, res) => {
    const { veterinario } = req

    res.json(veterinario)
}


const confirmar = async (req, res) => {
    const { token } = req.params

    const usuarioConfirmar = await Veterinario.findOne({ token })

    if (!usuarioConfirmar) {
        const error = new Error('Token no válido')
        return res.status(404).json({ msg: error.message })
    }

    try {
        usuarioConfirmar.token = null
        usuarioConfirmar.confirmado = true
        await usuarioConfirmar.save()

        res.json({ msg: 'Usuario confirmado correctamente' })

    } catch (error) {
        console.log(error)
    }
}


const autenticar = async (req, res) => {
    const { email, password } = req.body

    // Comprobar sí el usuario existe
    const usuario = await Veterinario.findOne({ email })

    if (!usuario) {
        const error = new Error('El usuario no existe')
        return res.status(404).json({ msg: error.message })
    }

    // Comprobar sí el usuario está confirmado o no
    if (!usuario.confirmado) {
        const error = new Error('Su cuenta no ha sido confirmada')
        return res.status(403).json({ msg: error.message })
    }

    // Revisar el password del usuario
    if (await usuario.comprobarPassword(password)) {
        // Autenticar el usuario
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id)
        })
    } else {
        const error = new Error('El password es incorrecto')
        return res.status(403).json({ msg: error.message })
    }
}


const olvidePassword = async (req, res) => {

    const { email } = req.body

    const existeVeterinario = await Veterinario.findOne({ email })

    if (!existeVeterinario) {
        const error = new Error('El usuario no existe')
        return res.status(400).json({ msg: error.message })
    }

    try {
        existeVeterinario.token = generarID()
        await existeVeterinario.save()

        // Enviar email con instrucciones
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        })

        res.json({ msg: "Hemos enviado un link de recuperación" })
    } catch (error) {
        console.log(error)
    }
}

const comprobarToken = async (req, res) => {
    const token = req.params.token

    const tokenValido = await Veterinario.findOne({ token })

    if (tokenValido) {
        // Token válido, el usuario existe
        res.json({ msg: 'Token válido, usuario registrado' })
    } else {
        const error = new Error('Token inválido')
        return res.status(400).json({ msg: error.message })
    }
}

const nuevoPassword = async (req, res) => {

    const { token } = req.params
    const { password } = req.body

    const veterinario = await Veterinario.findOne({ token })

    if (!veterinario) {
        const error = new Error('Hubo un error')
        return res.status(400).json({ msg: error.message })
    }

    try {
        veterinario.token = null
        veterinario.password = password
        await veterinario.save()
        res.json({ msg: 'Password modificada con éxito' })
    } catch (error) {
        console.log(error)
    }
}

const updateProfile = async (req, res) => {
    const { id } = req.params
    const veterinario = await Veterinario.findById(id).select("-password -__v")

    if (!veterinario) {
        const error = new Error('Hubo un error')
        return res.status(400).json({ msg: error.message })
    }

    if (veterinario.email !== req.body.email) {
        const { email } = req.body
        const existeEmail = await Veterinario.findOne({ email })
        if (existeEmail) {
            const error = new Error('Ese Email ya está en uso')
            return res.status(400).json({ msg: error.message })
        }
    }

    try {
        veterinario.nombre = req.body.nombre
        veterinario.email = req.body.email
        veterinario.web = req.body.web
        veterinario.telefono = req.body.telefono

        const veterinarioUpdated = await veterinario.save()

        res.json(veterinarioUpdated)
    } catch (error) {
        console.log(error)
    }
}

const updatePassword = async (req, res) => {
    // Leer los datos
    const { id } = req.veterinario
    const { actual_pwd, new_pwd } = req.body

    // Comprobar que existe el usuario
    const veterinario = await Veterinario.findById(id).select("-__v")

    if (!veterinario) {
        const error = new Error('Hubo un error')
        return res.status(400).json({ msg: error.message })
    }

    // Comprobar su password
    if (await veterinario.comprobarPassword(actual_pwd)) {
        // Almacenar el nuevo password
        veterinario.password = new_pwd
        await veterinario.save()
        res.json({ msg: 'Contraseña guardada correctamente' })
    } else {
        const error = new Error('La contraseña actual es incorrecta!')
        return res.status(400).json({ msg: error.message })

    }
}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    updateProfile,
    updatePassword
}